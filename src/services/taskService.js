import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc,updateDoc, doc , query, where  } from "firebase/firestore";

// Add Task
export const addTask = async (task) => {
    console.log("Inside addTask function, received task:", task); // ✅ Check function call
  
    try {
      const docRef = await addDoc(collection(db, "tasks"), task);
      console.log("Task added with ID:", docRef.id); // ✅ Check if Firestore stores it
    } catch (error) {
      console.error("Error adding task:", error); // ✅ Catch Firestore errors
    }
  };

// Fetch Tasks
export const getTasks = async (user) => {
    try {
      if (!user || typeof user !== "string") {
        console.error("🚨 Invalid user value:", user);
        return [];
      }
  
      console.log("🔍 Fetching tasks for user:", user);
  
      const q = query(collection(db, "tasks"), where("user", "==", user));
      console.log("🔎 Firestore Query Object:", q);
  
      const snapshot = await getDocs(q);
      console.log("📜 Firestore Snapshot:", snapshot);
  
      if (snapshot.empty) {
        console.warn("⚠️ No tasks found for this user!");
        return [];
      }
  
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("❌ Error fetching tasks:", error);
      return [];
    }
  };

export const updateTask = async (taskId, updatedData) => {
    try {
      const taskRef = doc(db, "tasks", taskId); // Reference the document
      await updateDoc(taskRef, updatedData);
      console.log("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

 export const deleteSelectedTasks = async (selectedTasks,fetchTasks,setSelectedTasks) => {
    if (selectedTasks.length === 0) return;

    try {
      await Promise.all(selectedTasks.map(taskId => deleteDoc(doc(db, "tasks", taskId))));
      setSelectedTasks([]); // Clear selection
      fetchTasks();
      console.log("✅ Selected tasks deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting tasks:", error);
    }
  };

export const updateSelectedTasksStatus = async (selectedTasks, newStatus, fetchTasks, setSelectedTasks) => {
    if (selectedTasks.length === 0 || !newStatus) return;
  
    try {
        console.log("Entered");
      await Promise.all(
        selectedTasks.map(taskId => 
          updateDoc(doc(db, "tasks", taskId), { status: newStatus })
        )
      );
  
      setSelectedTasks([]); // Clear selection after update
      fetchTasks(); // Refresh task list
      console.log(`✅ Selected tasks updated to "${newStatus}" successfully!`);
    } catch (error) {
      console.error("❌ Error updating task status:", error);
    }
  };

  
// Delete Task
export const deleteTask = async (taskId) => {
  await deleteDoc(doc(db, "tasks", taskId));
};
