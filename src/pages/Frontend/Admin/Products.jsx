import { message } from 'antd'
import { collection, addDoc } from "firebase/firestore";
import React, { useState } from 'react'
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
    const handleChange = (e) => {
        setProducts({ ...products, [e.target.name]: e.target.value })
    }


    const HandleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const docRef = await addDoc(collection(db, "users"), {
                ...products, createdAt: new Date()
            });
            console.log("Document written with ID: ", docRef.id);
            message.success("Product added successfully");

        } catch (error) {
            console.log('error', error)
            message.error('Failed to add product')
        }
        setLoading(false)

    }



    return (
        <div className='container'>
            <div className="row">
                <div className="col">

                    <h2 className='text-center py-5'>Add Product</h2>
                    <form onSubmit={HandleSubmit}>

                        <div>
                            <input type="file" className='form-control' name="image-url" id="" />
                        </div>

                        <div className='my-3'>
                            <input type="text" placeholder='Product Name' className='form-control' onChange={handleChange} name='productName' />
                        </div>
                        <div className='my-3'>
                            <textarea type="text" placeholder='Product description' className='form-control' onChange={handleChange} name='descriptions' />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='Sell Price' className='form-control' name='sellPrice' onChange={handleChange} />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='Del Price' className='form-control' name='delPrice' onChange={handleChange} />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='stock' className='form-control' name='stock' onChange={handleChange} />
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