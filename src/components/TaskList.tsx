import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';
import { TaskItem as TaskType } from '../utils/handle-api';

interface TaskListProps {
    tasks: TaskType[];
    updateMode: (id: string, text: string) => void;
    deleteToDo: (id: string) => void;
    listStyle?: any;
    contentContainerStyle?: any;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, updateMode, deleteToDo, listStyle, contentContainerStyle }) => {
    const renderItem = ({ item }: { item: TaskType }) => (
        <TaskItem
            text={item.text}
            updateMode={() => updateMode(item._id, item.text)}
            deleteToDo={() => deleteToDo(item._id)}
        />
    );

    return (
        <FlatList
            style={listStyle}
            contentContainerStyle={contentContainerStyle}
            data={tasks}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
        />
    );
};

export default TaskList;
