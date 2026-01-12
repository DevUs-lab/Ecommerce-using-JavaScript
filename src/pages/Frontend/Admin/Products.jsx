import React from 'react'

const Products = () => {
    return (
        <div className='container'>
            <div className="row">
                <div className="col">

                    <h2 className='text-center py-5'>Add Product</h2>
                    <form action="">

                        <div>
                            <input type="file" className='form-control' name="" id="" />
                        </div>

                        <div className='my-3'>
                            <input type="text" placeholder='Product Name' className='form-control' name='productName' />
                        </div>
                        <div className='my-3'>
                            <textarea type="text" placeholder='Product description' className='form-control' name='descriptions' />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='Sell Price' className='form-control' name='sellPrice' />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='Del Price' className='form-control' name='delPrice' />
                        </div>
                        <div className='my-3'>
                            <input type="number" placeholder='stock' className='form-control' name='stock' />
                        </div>
                        <div className='text-center'>

                            <button className='btn btn-primary w-50 text-center'>Add Product</button>
                        </div>
                    </form>
                </div>

            </div>


        </div>
    )
}

export default Products