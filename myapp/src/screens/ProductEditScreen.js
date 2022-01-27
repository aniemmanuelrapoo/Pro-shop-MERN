import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { Link } from 'react-router-dom'
import { PRODUCT_UPDATE_REST } from '../constants/productConstants'


const ProductEditScreen = () => {
    let { id } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)
    
    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error:errorUpdate, success: successUpdate } = productUpdate

    useEffect(() => {
        if(successUpdate){
            dispatch({ type: PRODUCT_UPDATE_REST })
            navigate('/admin/productlist')
        }else{
            if(!product.name || product._id !== id){
            dispatch(listProductDetails(id))
            }else{
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
    }, [product, dispatch, id, navigate, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const fromData = new FormData()
        fromData.append('image', file)
        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/upload', fromData, config)

            setImage(data)
            setUploading(false)
        } catch (error) {
            console.log(error)
            setUploading(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: id,
            name,
            price,
            image,
            brand,
            category,
            description,
            countInStock
        }))
    }
    
    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
        
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='text' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='price' className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image' className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type='text' placeholder='Enter Image Url' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                            {/* <Form.Group id='image-file' label='Choose File' custom onChange={uploadFileHandler}></Form.Group> */}
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control type="file" onChange={uploadFileHandler} />
                            </Form.Group>
                            {uploading && <Loader />}
                        </Form.Group>

                        <Form.Group controlId='brand' className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category' className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='countInStock' className="mb-3">
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control type='number' placeholder='Enter Count In Stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description' className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type='text' placeholder='Enter Description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen
