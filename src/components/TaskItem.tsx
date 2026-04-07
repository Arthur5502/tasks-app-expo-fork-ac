import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskItemProps {
  text: string;
  completed?: boolean;
  dueDate?: string | null;
  updateMode: () => void;
  deleteToDo: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ text, completed = false, dueDate = null, updateMode, deleteToDo }) => {
  const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString('pt-BR') : null;

  return (
    <View style={styles.todo}>
      <View style={styles.textBlock}>
        <Text style={[styles.text, completed && styles.completedText]}>{text}</Text>
        {formattedDueDate && <Text style={styles.metaText}>Vencimento: {formattedDueDate}</Text>}
      </View>
      <View style={styles.icons}>
        <Pressable onPress={updateMode} style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
          <Feather name="edit" size={20} color="#cdcd32" style={styles.icon} />
        </Pressable>
        <Pressable onPress={deleteToDo} style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}>
          <AntDesign name="delete" size={20} color="#bc2727" style={styles.icon} />
        </Pressable>
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
  textBlock: {
    flex: 1,
    paddingRight: 16,
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8c9aa5',
  },
  metaText: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  icons: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 16,
  },
  iconButton: {
    borderRadius: 8,
  },
  iconButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  icon: {
    padding: 6,
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default TaskItem;
