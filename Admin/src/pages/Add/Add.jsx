import React, { useEffect, useState } from 'react'
import './add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = ({URl}) => {

  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    category: "Uncategorized"
  })

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${URl}/api/category/list`)
      if (response.data.success) {
        const list = response.data.data || []
        setCategories(list)
        const uncategorized = list.find((c) => String(c.name).trim().toLowerCase() === "uncategorized")
        if (uncategorized && !data.categoryId) {
          setData((prev) => ({ ...prev, categoryId: uncategorized._id, category: uncategorized.name }))
        }
        return
      }
      toast.error(response.data.message || "Error")
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Error"
      toast.error(message)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("price", Number(data.price))
      if (data.categoryId) {
        formData.append("categoryId", data.categoryId)
      }
      formData.append("category", data.category)
      if (image) {
        formData.append("image", image)
      }

      const response = await axios.post(`${URl}/api/food/add`, formData)
      if (response.data.success) {
        const uncategorized = categories.find((c) => String(c.name).trim().toLowerCase() === "uncategorized")
        setData({
          name: "",
          description: "",
          price: "",
          categoryId: uncategorized?._id || "",
          category: uncategorized?.name || "Uncategorized"
        })
        setImage(null)
        toast.success(response.data.message)
        return
      }
      toast.error(response.data.message)
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Upload failed"
      toast.error(message)
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-image-upload flex-col">
          <p>Upload Image</p>
          <input
            className="add-file-input"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            type="file"
            accept="image/*"
          />
          {image ? <p className="add-file-name">{image.name}</p> : null}
          <img className="add-preview" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder='type here' required />
        </div>

        <div className="add-product-desc flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write Here" required></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              onChange={(e) => {
                const categoryId = e.target.value
                const category = categories.find((c) => String(c._id) === String(categoryId))
                setData((prev) => ({
                  ...prev,
                  categoryId,
                  category: category?.name || prev.category
                }))
              }}
              name='categoryId'
              value={data.categoryId}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder='20' min="0" step="1" required />
          </div>
        </div>

        <button type='submit' className='add-btn'>Add</button>
      </form>

    </div>
  )
}

export default Add
