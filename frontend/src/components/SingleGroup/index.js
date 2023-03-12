import { useParams } from 'react-router-dom'
import './index.css'

const SingleGroup = () => {
    const { groupId } = useParams();
    return (
        <div className="singlegroupmain">
            <p1>Hello From Single Groups!</p1>
            <p3>{groupId}</p3>
        </div>
    )
}

export default SingleGroup