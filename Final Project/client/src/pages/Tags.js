import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Tag from '../components/Tag';
import AskQuestion from '../components/AskQuestion';

import '../stylesheets/general.css';
import '../stylesheets/pages/Tags.css'

import Axios from 'axios';
const expressServer = "http://localhost:8000";

function Tags() {
    const [tags, setTags] = useState([]);
    const [dataFetchSuccess, setDataFetchSuccess] = useState(1);

    useEffect(() => {
        Axios.get(`${expressServer}/tags`)
            .then(res => {
                setTags(res.data);
                setDataFetchSuccess(1);
            })
            .catch(err => {
                console.log(err);
                setDataFetchSuccess(0);
            });
    }, []);

    return (
        <div className='page-wrapper tags-page-wrapper'>
            {dataFetchSuccess ?
                <>
                    <div className='tags-page-header-wrapper'>
                        <h2><span>{tags.length} </span> tags</h2>
                        <h2 className='dummy middle'>All Tags</h2>
                        <AskQuestion />
                    </div>
                    <div className='tags-page-content-wrapper'>
                        {tags.map((tag, index) => <Tag key={index} tag={tag} setDataFetchSuccess={setDataFetchSuccess} />)}
                    </div>
                </>
                :
                <>
                    <div className='big-font'>An Error Occured</div>
                    <Link className={"link med-font"} to='/'>
                        <div style={{ padding: 32 }}><span>Click Here to return to home page</span></div>
                    </Link>
                </>
            }
        </div>
    );
}

export default Tags;