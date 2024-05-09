'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

const EditClass = () => {
    const [videoLink, setVideoLink] = useState('');
    const [videoType, setVideoType] = useState('');
    const [classTitle, setClassTitle] = useState('');
    const [textValue, setTextValue] = useState('Modify Class');
    const [folderName, setFolderName] = useState('');
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [createdAt, setCreatedAt] = useState('');

    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const res = await axios.get(`/api/course/${params.id}/folders`);
                setFolders(res.data);
            } catch (error) {
                console.error('Error fetching folders:', error);
                toast.error('Failed to fetch folders');
            }
        };

        fetchFolders();
    }, [params.classId]);

    const handleGetDetails = async () => {

        try {
            const res = await axios.get(`/api/classes/getClassById/${params.classId}`);
            setVideoLink(res.data?.video.videoLink);
            setVideoType(res.data?.video.videoType);
            setClassTitle(res.data?.title);
            setFolderName(res.data?.Folder?.title);
            setSelectedFolder(res.data?.Folder.id);
            setCreatedAt(res.data?.createdAt?.toString());
            setShowForm(true);
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleEditClass = async () => {
        if (!videoLink.trim() || !classTitle.trim() || !videoType) {
            return toast.error('Please fill all fields');
        }

        setTextValue('Modifying Class...');

        try {
            const res = await axios.put('/api/classes/editClass', {
                classId: params.classId,
                courseId : params.id,
                classTitle,
                videoLink,
                videoType,
                createdAt : new Date(createdAt || ""),
                folderId: selectedFolder != "new" ? selectedFolder : undefined,
                folderName: selectedFolder == "new" ? folderName.trim() : undefined,
            });

            if (res.data.error) {
                toast.error(res.data.error.message())
            } else {
                toast.success('Class modified successfully')
                setTextValue('Class Modified');
                setVideoLink('');
                setClassTitle('');
                setSelectedFolder('');
                setCreatedAt('');
                router.push(`/courses/${params.id}/class/${res.data.id}`);
            }
        } catch (error) {
            toast.error('Failed to modify class');
        } finally {
            setTextValue(' Modify Class');
            router.refresh();
        }
    };

    
    return (
        <div className="mt-8">
            {
                showForm ?
                    <div className="flex flex-col items-center">
                        <select
                            value={videoType}
                            onChange={(e) => setVideoType(e.target.value)}
                            className="w-full sm:w-96 px-4 py-2 border border-secondary-300 rounded mb-4"
                        >
                            <option value="">Select Video Type</option>
                            <option value="DRIVE">Drive</option>
                            <option value="YOUTUBE">YouTube</option>
                    kw        <option value="ZOOM">Zoom</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Enter video link"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            className="w-full sm:w-96 px-4 py-2 border border-secondary-300 rounded mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Enter class title"
                            value={classTitle}
                            onChange={(e) => setClassTitle(e.target.value)}
                            className="w-full sm:w-96 px-4 py-2 border border-secondary-300 rounded mb-4"
                        />
                        <input
                        type="date"
                        placeholder="Enter class date"
                        value={createdAt}
                        onChange={(e) => setCreatedAt(e.target.value)}
                        className="w-full sm:w-96 px-4 py-2 border border-secondary-300 rounded mb-4"
                        />

                        <select
                            value={selectedFolder}
                            onChange={(e) => setSelectedFolder(e.target.value)}
                            className="w-full sm:w-96 px-4 py-2 border border-secondary-300 rounded mb-4"
                        >
                            <option value="">Select Folder (Optional)</option>
                            <option value="new">New Folder</option>
                            {folders.map((folder: any) => (
                                <option key={folder.id} value={folder.id}>
                                    {folder.title}
                                </option>
                            ))}
                        </select>
                        {(selectedFolder === 'new') && (
                            <input
                                type="text"
                                placeholder="Enter new folder name"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                className="w-full sm:w-96 px-4 py-2 border border-secondary-300 rounded mb-4"
                            />
                        )}
                        <Button
                            disabled={!videoLink || !classTitle || !videoType || textValue === 'Creating Class'}
                            className="flex justify-between items-center bg-secondary-700 hover:bg-secondary-800 text-white"
                            onClick={handleEditClass}
                        >
                            {textValue}
                            &nbsp;&nbsp;
                            {textValue === 'Creating Class' ? (
                                <div className="animate-spin">
                                    <FaPlus />
                                </div>
                            ) : (
                                <FaPlus />
                            )}
                        </Button>
                    </div>
                    : (
                        <div className="flex flex-col items-center">
                            <Button
                                className="flex justify-between items-center bg-secondary-700 text-white hover:bg-secondary-800"
                                onClick={() => { setShowForm(true), handleGetDetails() }}
                            >
                                Modify Class
                            </Button>
                        </div>
                    )
            }
        </div>
    );
};

export default EditClass;
