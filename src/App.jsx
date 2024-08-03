import Note from './components/Note'
import {useState, useEffect} from "react";
import noteService from './services/notes.js'
import Notification from "./components/Notificacion.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('a new note...');
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        noteService
            .getAll()
            .then(response => {
                setNotes(response.data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleNoteChange = (e) => {
        setNewNote(e.target.value);
    }

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        }

        noteService
            .create(noteObject)
            .then(response => {
                setNotes(notes.concat(response.data))
                setNewNote('');
            })
            .catch(error => console.log(error));
    }

    const toggleImportanceOf = (id) => {
        const note = notes.find((note) => note.id === id);
        const changedNote = {...note, important: !note.important};
        noteService
            .update(id, changedNote)
            .then(response => {
                setNotes(notes.map(note => note.id !== id ? note : response.data));
            })
            .catch(error => {
                setErrorMessage(`The note ${note.content} war already deleted from the server.`);
                setTimeout(() => {
                    setErrorMessage(null)
                }, 3000);
                setNotes(notes.filter(n => n.id !== id))
                console.error(error);
            });
    }

    const notesToShow = showAll ? notes : notes.filter((note) => note.important);

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage}/>
            <div>
                <button onClick={() => setShowAll(!showAll)}>show {showAll ? 'important' : 'all'}</button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
                )}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type="submit">Save</button>
            </form>

            <Footer/>
        </div>
    )
}

export default App
