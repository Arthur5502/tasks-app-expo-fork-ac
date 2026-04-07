import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';
import { TaskItem as TaskType } from '../utils/handle-api';

interface TaskListProps {
    tasks: TaskType[];
    updateMode: (id: string, text: string, completed?: boolean, dueDate?: string | null) => void;
    deleteToDo: (id: string) => void;
    listStyle?: any;
    contentContainerStyle?: any;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, updateMode, deleteToDo, listStyle, contentContainerStyle }) => {
    const renderItem = ({ item }: { item: TaskType }) => (
        <TaskItem
            text={item.text}
            completed={item.completed ?? false}
            dueDate={item.dueDate ?? null}
            updateMode={() => updateMode(item._id, item.text, item.completed ?? false, item.dueDate ?? null)}
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
