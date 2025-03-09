import { db } from "../firebaseConfig";
import { format } from "date-fns";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import axios from "axios";

export const addTask = async (task) => {
  try {
    const newTask = {
      ...task,
      files: task.files || "",
      activities: [
        {
          action: "You created this task",
          timestamp: format(new Date(), "MMM dd 'at' h:mm a"),
          user: task.user,
        },
      ],
    };

    await addDoc(collection(db, "tasks"), newTask);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const getTasks = async (user) => {
  try {
    if (!user) {
      return [];
    }

    const q = query(collection(db, "tasks"), where("user", "==", user));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const updateTask = async (taskId, newTask, oldTask) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const activities = [];

    const formattedTime = format(new Date(), "MMM dd 'at' h:mm a");

    if (newTask.title && newTask.title !== oldTask.title) {
      activities.push({
        action: `Changed title from "${oldTask.title}" to "${newTask.title}"`,
        timestamp: formattedTime,
        user: oldTask.user,
      });
    }
    if (newTask.description && newTask.description !== oldTask.description) {
      activities.push({
        action: "Updated task description",
        timestamp: formattedTime,
        user: oldTask.user,
      });
    }
    if (newTask.category && newTask.category !== oldTask.category) {
      activities.push({
        action: `You Changed category from "${oldTask.category}" to "${newTask.category}"`,
        timestamp: formattedTime,
        user: oldTask.user,
      });
    }
    if (newTask.dueDate && newTask.dueDate !== oldTask.dueDate) {
      activities.push({
        action: `You Changed due date from "${oldTask.dueDate}" to "${newTask.dueDate}"`,
        timestamp: formattedTime,
        user: oldTask.user,
      });
    }
    if (newTask.status && newTask.status !== oldTask.status) {
      activities.push({
        action: `You Changed status from "${oldTask.status}" to "${newTask.status}"`,
        timestamp: formattedTime,
        user: oldTask.user,
      });
    }
    if ((newTask.files?.length || 0) > (oldTask.files?.length || 0)) {
      activities.push({
        action: "You Uploaded a file",
        timestamp: formattedTime,
        user: oldTask.user,
      });
    }
    if ((newTask.files?.length || 0) < (oldTask.files?.length || 0)) {
      activities.push({
        action: "You removed a file",
        timestamp: formattedTime,
        user: oldTask.user,
      });
    }

    await updateDoc(taskRef, {
      ...newTask,
      activities: arrayUnion(...activities),
    });
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteSelectedTasks = async (
  selectedTasks,
  fetchTasks,
  setSelectedTasks
) => {
  if (selectedTasks.length === 0) return;

  try {
    await Promise.all(
      selectedTasks.map((taskId) => deleteDoc(doc(db, "tasks", taskId)))
    );
    setSelectedTasks([]);
    fetchTasks();
  } catch (error) {
    console.error("Error deleting tasks:", error);
  }
};

export const updateSelectedTasksStatus = async (
  selectedTasks,
  newStatus,
  fetchTasks,
  setSelectedTasks
) => {
  if (selectedTasks.length === 0 || !newStatus) return;

  try {
    await Promise.all(
      selectedTasks.map((taskId) =>
        updateDoc(doc(db, "tasks", taskId), { status: newStatus })
      )
    );

    setSelectedTasks([]);
    fetchTasks();
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "task_manager");
  formData.append("cloud_name", "dgfnsxnv3");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dgfnsxnv3/image/upload",
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
