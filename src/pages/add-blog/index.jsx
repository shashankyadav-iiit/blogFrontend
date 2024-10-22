import { useContext, useEffect } from 'react';
import classes from './styles.module.css';
import { GlobalContext } from '../../context';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';

export default function AddNewBlog(){

    const {formData,setFormData,currentEditedData,setCurrentEditedData} = useContext(GlobalContext);
    const navigate = useNavigate();
    const location = useLocation();


    // console.log(formData);


    async function handleSaveBlogToDatabase(){

        const response = currentEditedData ?await axios.put(`http://localhost:5000/api/blogs/update/${location.state.getCurrentBlogItem._id}`,{
            title: formData.title,
            description: formData.description
        }) :await axios.post('http://localhost:5000/api/blogs/add', {
            title: formData.title,
            description: formData.description
        })

        const result  = await response.data;

        // console.log(result);

        if(result){
            setCurrentEditedData(false);
            setFormData({
                title:"",
                description:""
            })
            navigate('/');
        }

    }

    useEffect(()=>{
        // console.log(location);
        if(location.state){
            const {getCurrentBlogItem} = location.state;
            setCurrentEditedData(true);
            setFormData({
                title: getCurrentBlogItem.title,
                description: getCurrentBlogItem.description
            })
        }
    },[location]);



    return (
        <div className={classes.wrapper}>
            <h1>{currentEditedData ? 'Edit a Blog' : 'Add a Blog' }</h1>
            <div className={classes.formWrapper}>
                <input
                name='title'
                placeholder='Enter Blog Title'
                id='title'
                type='text'
                value={formData.title}
                onChange={(e) => setFormData({
                    ...formData,
                    title: e.target.value
                })}
                />
                <textarea
                name='description'
                placeholder='Enter Blog Description'
                id='description'
                value={formData.description}
                onChange={(event) =>{
                    setFormData({
                        ...formData,
                        description: event.target.value
                    })
                } }
                />
                <button onClick={handleSaveBlogToDatabase}> {currentEditedData ? 'Edit Blog' : 'Add Blog'} </button>
            </div>
        </div>
    );
}