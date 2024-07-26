import Create from '@/components/Create';
import { getServerSession } from 'next-auth';


const CreatePage = async () => {

    const session = await getServerSession();
    console.log(session);

    return (
        <div>
            <Create />
        </div>
    );
}

export default CreatePage;