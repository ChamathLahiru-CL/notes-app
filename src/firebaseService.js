import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  orderBy,
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collection name
const NOTES_COLLECTION = 'notes';

// Add a new note
export const addNote = async (noteData) => {
  try {
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
      title: noteData.title,
      content: noteData.content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Note added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding note: ', error);
    throw error;
  }
};

// Get all notes
export const getNotes = async () => {
  try {
    const q = query(collection(db, NOTES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const notes = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notes.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        date: data.createdAt ? data.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()
      });
    });
    return notes;
  } catch (error) {
    console.error('Error getting notes: ', error);
    throw error;
  }
};

// Delete a note
export const deleteNote = async (noteId) => {
  try {
    await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
    console.log('Note deleted successfully');
  } catch (error) {
    console.error('Error deleting note: ', error);
    throw error;
  }
};

// Update a note
export const updateNote = async (noteId, updatedData) => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, noteId);
    await updateDoc(noteRef, {
      title: updatedData.title,
      content: updatedData.content,
      updatedAt: serverTimestamp()
    });
    console.log('Note updated successfully');
  } catch (error) {
    console.error('Error updating note: ', error);
    throw error;
  }
};
