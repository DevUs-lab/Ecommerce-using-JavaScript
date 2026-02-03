import { setDoc, doc, deleteDoc, updateDoc, serverTimestamp, collection, getDocs } from "firebase/firestore";
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../../firebase/config';
import { getProducts } from '../../../Context/getProducts';
import { Spin } from "antd";
import { AntdMess } from "../../../Components/Antd";

const AddProducts = () => {
    const initialstate = {
        productName: '',
        descriptions: '',
        sellPrice: '',
        delPrice: '',
        stock: '',
        category: ''
    }

    const [categoriesloading, setCategoriesloading] = useState(false);
    const [deletingCat, setDeletingCat] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [productsList, setProductsList] = useState([])
    const [products, setProducts] = useState(initialstate)
    const [images, setImages] = useState([]);
    const [editId, setEditId] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoriesFetching, setCategoriesFetching] = useState(false);


    const makeSlug = (text) =>
        text.toLowerCase().replace(/\s+/g, "-");


    const handleAddCategory = async (e) => {
        e.preventDefault()

        setCategoriesloading(true);
        if (!categoryName) {
            AntdMess({ type: "error", messageText: "Category name required" });
            setCategoriesloading(false);

            return;
        }

        const slug = makeSlug(categoryName);
        try {
            await setDoc(doc(db, "categories", slug), {
                name: categoryName,
                slug,
                createdAt: serverTimestamp()
            });

            AntdMess({ type: "success", messageText: "Category added" });
            setCategoryName("");
            fetchProducts(); // IMPORTANT
        } catch (error) {
            console.log("Failed to add category", error);
            AntdMess({ type: "error", messageText: "Failed to add category" });
        } finally {
            setCategoriesloading(false);
        }

    };



    const handleChange = (e) => {
        setProducts({ ...products, [e.target.name]: e.target.value })
    }

    const fileRef = useRef(null);

    const HandleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {

            if (!editId) {
                if (images.length === 0) {
                    AntdMess({ type: "error", messageText: "Please select at least one image" });
                    setLoading(false);
                    return

                }


                const uploadedImages = await uploadImagesToCloudinary()

                const date = new Date().getTime()
                const id = `prod_${date}`

                // Create document with specific id in the top-level `products` collection
                await setDoc(doc(db, "products", id), {
                    productName: products.productName,
                    descriptions: products.descriptions,
                    sellPrice: Number(products.sellPrice),
                    delPrice: Number(products.delPrice),
                    stock: Number(products.stock),
                    category: products.category,
                    itemImages: uploadedImages, // Store array of {url, publicId}
                    imageUrl: uploadedImages[0]?.url, // Keep main image for backward compatibility
                    createdAt: serverTimestamp()
                })


                AntdMess({ type: "success", messageText: "Product added successfully" });
                fetchProducts();
                setProducts(initialstate)
                setImages([])
                fileRef.current.value = "";

            } else {

                // Logic for editing images could be complex (add/remove), 
                // for now let's just update text fields or replace images if new ones selected
                let updatedData = {
                    productName: products.productName,
                    descriptions: products.descriptions,
                    sellPrice: Number(products.sellPrice),
                    delPrice: Number(products.delPrice),
                    stock: Number(products.stock),
                    category: products.category,
                    updatedAt: new Date()
                };

                if (images.length > 0) {
                    const uploadedImages = await uploadImagesToCloudinary()
                    updatedData.itemImages = uploadedImages;
                    updatedData.imageUrl = uploadedImages[0]?.url;
                }

                await updateDoc(doc(db, "products", editId), updatedData);

                AntdMess({ type: "success", messageText: "Product updated" });
                fetchProducts();
                setEditId(null);
                setProducts(initialstate);
                setImages([]);
                if (fileRef.current) fileRef.current.value = "";
            }
        } catch (error) {
            console.log(error)
            AntdMess({ type: "error", messageText: "Failed to add product" });
        }
        setLoading(false)

    }


    const uploadImagesToCloudinary = async () => {
        const uploadPromises = images.map(async (image) => {
            const formData = new FormData()
            formData.append("file", image)
            formData.append("upload_preset", "products_upload")

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/umairdevus/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            )
            const data = await res.json()
            return {
                url: data.secure_url, // Changed to lowercase 'url' to be consistent or match cloud response
                publicId: data.public_id
            }
        });

        return Promise.all(uploadPromises);
    }



    const fetchProducts = async () => {
        setFetching(true)
        setCategoriesFetching(true);

        try {
            // PRODUCTS
            const productsData = await getProducts()
            setProductsList(productsData)

            if (productsData.length === 0) {
                AntdMess({ type: "info", messageText: "No products found" });
            }

            // CATEGORIES
            const categorySnapshot = await getDocs(collection(db, "categories"))
            const categoriesList = categorySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setCategories(categoriesList)

        } catch (error) {
            console.log("error", error)
            AntdMess({ type: "error", messageText: "Failed to fetch data" });
        } finally {
            setFetching(false)
            setCategoriesFetching(false);

        }

    }

    const handleDelete = async (item) => {
        setDeletingId(item.id);
        try {
            await deleteDoc(doc(db, "products", item.id));
            setProductsList(prev =>
                prev.filter(p => p.id !== item.id)
            );
            AntdMess({ type: "success", messageText: "Product deleted" });
        } catch {
            AntdMess({ type: "error", messageText: "Delete failed" });
        }
        setDeletingId(null);
    };



    const handleEdit = (item) => {
        setProducts({
            productName: item.productName,
            descriptions: item.descriptions,
            sellPrice: item.sellPrice,
            delPrice: item.delPrice,
            stock: item.stock,
            category: item.category,
        });

        setEditId(item.id);
    };

    useEffect(() => { fetchProducts() }, [])


    const handleDeleteCategory = async (id) => {
        const hasProducts = productsList.some(p => p.category === id);
        setDeletingCat(id);
        if (hasProducts) {
            AntdMess({ type: "error", messageText: "Cannot delete category with products." });
            setDeletingCat(null);
            return;
        }

        if (!window.confirm("Are you sure you want to delete this category?")) { setDeletingCat(null); return };

        try {
            await deleteDoc(doc(db, "categories", id));
            AntdMess({ type: "success", messageText: "Category deleted" });
            fetchProducts();
        } catch (error) {
            console.log(error);
            AntdMess({ type: "error", messageText: "Failed to delete category" });
        }
        setDeletingCat(null);
    };

    return (
        <div className='container'>
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center py-5">Add Category</h2>
                    <form onSubmit={handleAddCategory}>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Category Name"
                            value={categoryName} disabled={categoriesloading}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <div className="text-center mt-2">
                            <button className="btn btn-primary" disabled={categoriesloading}>
                                {categoriesloading ? <Spin size="small" /> : "Add Category"}
                            </button>
                        </div>

                    </form>
                    <h5 className="mt-4">Manage Categories</h5>

                    <ul className="list-group">
                        {categoriesFetching ? (
                            <div className="d-flex justify-content-center py-3">
                                <Spin />
                            </div>
                        ) :
                            categories.map(cat => (
                                <li
                                    key={cat.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <span>{cat.name}</span>

                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        disabled={deletingCat === cat.id}
                                    >
                                        {deletingCat === cat.id ? <span className="d-flex align-items-center gap-2">
                                            <Spin size="small" />
                                            Deleting...
                                        </span> : "Delete"}
                                    </button>
                                </li>
                            ))}
                    </ul>

                </div>
            </div>
            <div className="row">
                <div className="col">

                    <h2 className='text-center py-5'>Add Product</h2>



                    <form onSubmit={HandleSubmit}>

                        <div>
                            {!editId && (
                                <input
                                    ref={fileRef}
                                    type="file"
                                    className="form-control"
                                    multiple
                                    onChange={(e) => setImages([...e.target.files])}
                                />
                            )}
                        </div>

                        <div className='my-3'>
                            <input type="text" placeholder='Product Name' className='form-control' onChange={handleChange} name='productName' value={products.productName} />
                        </div>
                        <div className='my-3'>
                            <textarea type="text" placeholder='Product description' className='form-control' onChange={handleChange} name='descriptions' value={products.descriptions} />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='Sell Price' className='form-control' name='sellPrice' onChange={handleChange} value={products.sellPrice} />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='Del Price' className='form-control' name='delPrice' onChange={handleChange} value={products.delPrice} />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='stock' className='form-control' name='stock' onChange={handleChange} value={products.stock} />
                        </div>

                        <div className='my-3'>
                            <select
                                className="form-control"
                                name="category"
                                value={products.category} onChange={handleChange} >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.slug} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='text-center'>
                            {
                                editId ? loading ? <button className='btn btn-primary w-50 text-center' disabled>Updating...</button> : <button className='btn btn-primary w-50 text-center'>Update Product</button> :
                                    loading ? <button className='btn btn-primary w-50 text-center' disabled>Adding...</button> : <button className='btn btn-primary w-50 text-center'>Add Product</button>
                            }
                        </div>
                    </form>
                </div>

            </div >

            <div className="row mt-5">
                {fetching ? (
                    <div className="d-flex align-items-center justify-content-center py-5">
                        <Spin size="large" />
                    </div>
                ) : (
                    productsList.map((item) => (
                        <div className="col-md-4 py-3" key={item.id}>
                            <div className="card">
                                <img src={item.imageUrl} className="card-img-top" />
                                <div className='py-4'>
                                    <div className="card-body">
                                        <h5>{item.productName}</h5>
                                        <p>{item.descriptions}</p>
                                        <p>Price: {item.sellPrice} <span>del: <del>{item.delPrice}</del></span></p>
                                        <p>Stock: {item.stock}</p>
                                        <p className="text-muted">
                                            Added on:{" "}
                                            {item.createdAt
                                                ? item.createdAt.toDate
                                                    ? item.createdAt.toDate().toLocaleString("en-GB", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short"
                                                    })
                                                    : new Date(item.createdAt).toLocaleString("en-GB", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short"
                                                    })
                                                : "N/A"}
                                        </p>

                                    </div>
                                    <div className='text-center ms-auto d-flex justify-content-center gap-3 mb-3'>
                                        {
                                            <button
                                                className="btn btn-danger"
                                                disabled={deletingId === item.id}
                                                onClick={() => handleDelete(item)}
                                            >
                                                {deletingId === item.id ? "Deleting..." : "Delete"}
                                            </button>

                                        }
                                        <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button>
                                    </div>


                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div >
    )
}

export default AddProducts