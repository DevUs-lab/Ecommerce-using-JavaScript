import { message } from 'antd'
import { setDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from 'react'
import { db } from '../../../firebase/config';
import { getProducts } from '../../../Context/loginContext';

const Products = () => {
    const initialstate = {
        productName: '',
        descriptions: '',
        sellPrice: '',
        delPrice: '',
        stock: ''
    }

    const [loading, setLoading] = useState(false)
    const [productsList, setProductsList] = useState([])
    const [products, setProducts] = useState(initialstate)
    const [image, setImage] = useState(null)
    const [editId, setEditId] = useState(null);

    const handleChange = (e) => {
        setProducts({ ...products, [e.target.name]: e.target.value })
    }

    const fileRef = useRef(null);

    const HandleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {

            if (!editId) {
                if (!image) {
                    message.error("Please select an image")
                    return
                }


                const { imageUrl, publicId } = await uploadImageToCloudinary()

                const date = new Date().getTime()
                const id = `prod_${date}`

                // Create document with specific id in the top-level `products` collection
                await setDoc(doc(db, "products", id), {
                    productName: products.productName,
                    descriptions: products.descriptions,
                    sellPrice: Number(products.sellPrice),
                    delPrice: Number(products.delPrice),
                    stock: Number(products.stock),
                    imageUrl,
                    publicId,
                    createdAt: new Date()
                })


                message.success("Product added successfully")
                fetchProducts()

                setProducts(initialstate)
                setImage(null)
                fileRef.current.value = "";

            } else {

                await updateDoc(doc(db, "products", editId), {
                    productName: products.productName,
                    descriptions: products.descriptions,
                    sellPrice: Number(products.sellPrice),
                    delPrice: Number(products.delPrice),
                    stock: Number(products.stock),
                    updatedAt: new Date()
                });

                message.success("Product updated");
            }
        } catch (error) {
            console.log(error)
            message.error("Failed to add product")
        }
        setLoading(false)

    }


    const uploadImageToCloudinary = async () => {
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
            imageUrl: data.secure_url,
            publicId: data.public_id
        }
    }



    const fetchProducts = async () => {

        setLoading(true)

        try {
            const data = await getProducts()

            // const productsList = data.map(doc => ({ id: doc.id, ...doc.data() }))
            setProductsList(data)
            console.log('productsList', data)
        } catch (error) {
            console.log('error', error)
            message.error("Failed to fetch products")

        }
        setLoading(false)
    }

    const handleDelete = async (item) => {
        try {
            await deleteDoc(doc(db, "products", item.id));

            setProductsList(prev =>
                prev.filter(product => product.id !== item.id)
            );

            message.success("Product deleted");
        } catch (error) {
            console.log(error);
            message.error("Delete failed");
        }
    };


    const handleEdit = (item) => {
        setProducts({
            productName: item.productName,
            descriptions: item.descriptions,
            sellPrice: item.sellPrice,
            delPrice: item.delPrice,
            stock: item.stock,
        });

        setEditId(item.id);
    };

    useEffect(() => { fetchProducts() }, [])


    return (
        <div className='container'>
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
                                    onChange={(e) => setImage(e.target.files[0])}
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
                        <div className='text-center'>
                            {
                                editId ? loading ? <button className='btn btn-primary w-50 text-center' disabled>Updating...</button> : <button className='btn btn-primary w-50 text-center'>Update Product</button> :
                                    loading ? <button className='btn btn-primary w-50 text-center' disabled>Adding...</button> : <button className='btn btn-primary w-50 text-center'>Add Product</button>
                            }
                        </div>
                    </form>
                </div>

            </div>

            <div className="row mt-5">
                {loading && <p>Loading...</p>}

                {productsList.map((item) => (
                    <div className="col-md-4" key={item.id}>
                        <div className="card">
                            <img src={item.imageUrl} className="card-img-top" />
                            <div className='py-4'>
                                <div className="card-body">
                                    <h5>{item.productName}</h5>
                                    <p>{item.descriptions}</p>
                                    <p>Price: {item.sellPrice} <span>del: {item.delPrice}</span></p>
                                    <p>Stock: {item.stock}</p>
                                </div>
                                <div className='text-center ms-auto'>
                                    <button className='btn btn-danger me-4' onClick={() => handleDelete(item)}>Delete</button>
                                    <button className='btn btn-warning' onClick={() => handleEdit(item)}>Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Products