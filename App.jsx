import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";

const todoList = () => {
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState('')
    const [editingIndex, setEditingIndex] = useState(null)
    const [editedTask, setEditedTask] = useState('')

    useEffect(() => {
        refreshTodoList()
    }, []);
    const refreshTodoList = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('tasks')
            if (storedTasks !== null) {
                setTasks(JSON.parse(storedTasks))
            }
        } catch (error) {
            console.error('Error occured while loading tasks:', error)
        }
    }

    const saveTasks = async (updatedTasks) => {
        try {
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks))
        } catch (error) {
            console.error('Error occured while saving tasks', error)
        }
    }

    const addTask = () => {
        if (newTask.trim() !== '') {
            const updatedTasks = [...tasks, newTask]
            setTasks(updatedTasks)
            setNewTask('')
            saveTasks(updatedTasks)
        }
        else {
            Alert.alert('Warning', 'Add a task, please', [{ text: 'Got it!', onPress: () => console.log("I'm closing alert window") }])
        }
    }

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index)
        setTasks(updatedTasks)
        saveTasks(updatedTasks)
    }

    const clearAllTasks = () => {
        setTasks([])
        saveTasks([])
    }
    const editTask = (index, task) => {
        setEditingIndex(index)
        setEditedTask(task)
    }

    const saveEditedTask = (index) => {
        const updatedTasks = [...tasks]
        updatedTasks[index] = editedTask
        setTasks(updatedTasks)
        setEditingIndex(null)
        setEditedTask('')
        saveTasks(updatedTasks)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My ToDo List</Text>
            <View style={styles.inputSave}>
                <TextInput
                    style={styles.input}
                    placeholder="Add Task Here"
                    value={newTask}
                    onChangeText={setNewTask}
                />
                <View style={styles.saveButton}>
                    <Button title="Save" onPress={addTask} />
                </View>
            </View>
            <ScrollView style={{ flex: 1 }}>
                {tasks.map((task, index) => (
                    <View key={index} style={styles.tasksMain}>
                        {editingIndex === index ? (
                            <>
                                <TextInput style={styles.editInput}
                                    value={editedTask}
                                    onChangeText={setEditedTask}
                                />
                                <TouchableOpacity onPress={() =>
                                    saveEditedTask(index)}>
                                    <FontAwesome5 name="save" size={24} color="blue" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.taskItself}>
                                    {task}
                                </Text>
                                <TouchableOpacity onPress={() => editTask(index, task)}>
                                    <FontAwesome5 name="edit" marginRight={6} marginLeft={6} size={20} color="orange" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() =>
                                    deleteTask(index)}>
                                    <FontAwesome5 name='trash' size={20} color="red" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                ))}
            </ScrollView>
            {tasks.length > 0 && (
                <Button title="Clear All Tasks" color="red" onPress={clearAllTasks} />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5'
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 40
    },
    inputSave: {
        flexDirection: 'row',
        marginBottom: 20
    },
    input: {
        flex: 1,
        padding: 10,
        borderColor: 'gray',
        marginRight: 4,
        borderWidth: 1,
        borderRadius: 10
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    tasksMain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    editInput: {
        flex: 1,
        marginRight: 10,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10
    },
    taskItself: {
        flex: 1,
        fontSize: 18,
        backgroundColor: 'lightblue',
        borderRadius: 20,
        padding: 10
    },
})

export default todoList