import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskItemProps {
  text: string;
  updateMode: () => void;
  deleteToDo: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ text, updateMode, deleteToDo }) => {
  return (
    <View style={styles.todo}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={updateMode}>
          <Feather name="edit" size={20} color="#cdcd32" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteToDo}>
          <AntDesign name="delete" size={20} color="#bc2727" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todo: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 16,
  },
  icon: {
    padding: 6,
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default TaskItem;
