import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const updateMode = (_id: string, text: string) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Excluir todas",
      "Tem certeza que deseja excluir todas as tarefas?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            tasks.forEach(task => deleteTask(task._id, setTasks));
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={require('./assets/task-app-banner.png')} style={styles.image} />
        <Text style={styles.header}>Tarefas</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Total de tarefas: {tasks.length}
          </Text>
        </View>

        <View style={styles.top}>
          <TextInput
            style={styles.input}
            placeholder="Ex: Eu amo react Native"
            placeholderTextColor="#888"
            maxLength={20}
            keyboardType="default"
            autoCapitalize="sentences"
            value={text}
            onChangeText={(val) => setText(val)}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={
              isUpdating
                ? () => updateTask(taskId, text, setTasks, setText, setIsUpdating)
                : () => addTask(text, setText, setTasks)
            }
          >
            <Text style={styles.addButtonText}>
              {isUpdating ? "Atualizar" : "Adicionar"}
            </Text>
          </TouchableOpacity>
        </View>

        <TaskList
          listStyle={styles.list}
          contentContainerStyle={styles.listContent}
          tasks={tasks}
          updateMode={updateMode}
          deleteToDo={(id) => deleteTask(id, setTasks)}
        />

        {tasks.length > 0 && (
          <View style={styles.actionContainer}>
            <Button title="Excluir todas as tarefas" onPress={handleDeleteAll} color="#e53935" />
          </View>
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  image: {
    position: 'relative',
    display: 'flex',
    alignSelf: 'center',
    width: '50%',
    height: '15%',
  },
  header: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  list: {
    marginTop: 16,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
});
