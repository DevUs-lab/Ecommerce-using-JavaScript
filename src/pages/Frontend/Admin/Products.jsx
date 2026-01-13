import { message } from 'antd'
import { setDoc, doc } from "firebase/firestore";
import React, { useRef, useState } from 'react'
import { db } from '../../../firebase/config';

const Products = () => {
    const initialstate = {
        productName: '',
        descriptions: '',
        sellPrice: '',
        delPrice: '',
        stock: ''
    }

    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState(initialstate)
    const [image, setImage] = useState(null)

    const handleChange = (e) => {
        setProducts({ ...products, [e.target.name]: e.target.value })
    }

    const fileRef = useRef(null);

    const HandleSubmit = async (e) => {
        e.preventDefault()

        if (!image) {
            message.error("Please select an image")
            return
        }

        try {
            setLoading(true)

            const imageUrl = await uploadImageToCloudinary()

            const date = new Date().getTime()
            const id = `prod_${date}`

            // Create document with specific id in the top-level `products` collection
            await setDoc(doc(db, "products", id), {
                productName: products.productName,
                descriptions: products.descriptions,
                sellPrice: Number(products.sellPrice),
                delPrice: Number(products.delPrice),
                stock: Number(products.stock),
                imageUrl: imageUrl,
                createdAt: new Date()
            })

            message.success("Product added successfully")
            setProducts(initialstate)
            setImage(null)
            fileRef.current.value = "";

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
        return data.secure_url
    }



    return (
        <div className='container'>
            <div className="row">
                <div className="col">

                    <h2 className='text-center py-5'>Add Product</h2>
                    <form onSubmit={HandleSubmit}>

                        <div>
                            <input ref={fileRef}
                                type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
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
                                loading ? <button className='btn btn-primary w-50 text-center' disabled>Adding...</button> : <button className='btn btn-primary w-50 text-center'>Add Product</button>
                            }
                        </div>
                    </form>
                </div>

            </div>


        </div>
    )
}

export default Products