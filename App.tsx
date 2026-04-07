import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const resetForm = () => {
    setText("");
    setIsUpdating(false);
    setTaskId("");
    setCompleted(false);
    setDueDate(null);
    setShowDatePicker(false);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const updateMode = (_id: string, text: string, taskCompleted = false, taskDueDate: string | null = null) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
    setCompleted(taskCompleted);
    setDueDate(taskDueDate);
    setShowDatePicker(false);
    setModalVisible(true);
  };

  const handleSaveTask = () => {
    if (!text.trim()) {
      Alert.alert("Campo obrigatório", "Adicione um título para a tarefa.");
      return;
    }

    if (isUpdating) {
      updateTask(taskId, text.trim(), completed, dueDate, setTasks, closeModal);
      return;
    }

    addTask(text.trim(), completed, dueDate, setTasks, closeModal);
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setDueDate(selectedDate.toISOString());
    }
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

        <View style={styles.actionContainer}>
          <Pressable
            onPress={openCreateModal}
            style={({ pressed }) => [styles.primaryActionButton, pressed && styles.actionPressed]}
          >
            <Text style={styles.primaryActionButtonText}>Nova Tarefa</Text>
          </Pressable>

          {tasks.length > 0 && (
            <Pressable
              style={({ pressed }) => [styles.deleteAllButton, pressed && styles.actionPressed]}
              onPress={handleDeleteAll}
            >
              <Text style={styles.deleteAllButtonText}>Excluir todas as tarefas</Text>
            </Pressable>
          )}
        </View>

        <TaskList
          listStyle={styles.list}
          contentContainerStyle={styles.listContent}
          tasks={tasks}
          updateMode={updateMode}
          deleteToDo={(id) => deleteTask(id, setTasks)}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{isUpdating ? 'Editar tarefa' : 'Nova tarefa'}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Eu amo React Native"
              placeholderTextColor="#8b8b8b"
              maxLength={60}
              keyboardType="default"
              autoCapitalize="sentences"
              value={text}
              onChangeText={setText}
            />

            <View style={styles.checkboxRow}>
              <View style={styles.checkboxTextBlock}>
                <Text style={styles.fieldLabel}>Marcar como concluída</Text>
                <Text style={styles.fieldHint}>Ative quando a tarefa já tiver sido finalizada.</Text>
              </View>
              <Checkbox
                value={completed}
                onValueChange={setCompleted}
                color={completed ? '#184e77' : undefined}
              />
            </View>

            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={({ pressed }) => [styles.dateButton, pressed && styles.dateButtonPressed]}
            >
              <Text style={styles.fieldLabel}>Data de vencimento</Text>
              <Text style={styles.dateButtonValue}>
                {dueDate ? new Date(dueDate).toLocaleDateString('pt-BR') : 'Selecionar data'}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate ? new Date(dueDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            <View style={styles.modalActions}>
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => [styles.secondaryActionButton, pressed && styles.actionPressed]}
              >
                <Text style={styles.secondaryActionButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSaveTask}
                style={({ pressed }) => [styles.saveButton, pressed && styles.actionPressed]}
              >
                <Text style={styles.saveButtonText}>{isUpdating ? 'Atualizar' : 'Salvar'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  primaryActionButton: {
    flexGrow: 1,
    minWidth: 150,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#184e77',
    borderRadius: 999,
    shadowColor: '#184e77',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryActionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  deleteAllButton: {
    flexGrow: 1,
    minWidth: 170,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#f2b8b5',
    borderRadius: 999,
  },
  deleteAllButtonText: {
    color: '#d32f2f',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  actionPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.94,
    elevation: 1,
  },
  list: {
    marginTop: 0,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 18, 28, 0.72)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    gap: 14,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#11243a',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#d8e1ea',
    borderRadius: 16,
    backgroundColor: '#f7fafc',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 2,
  },
  checkboxTextBlock: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#22324a',
  },
  fieldHint: {
    marginTop: 4,
    fontSize: 12,
    color: '#667085',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d8e1ea',
    borderRadius: 16,
    backgroundColor: '#f7fafc',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
  },
  dateButtonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.92,
  },
  dateButtonValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#184e77',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  secondaryActionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f7',
  },
  secondaryActionButtonText: {
    color: '#334155',
    fontWeight: '800',
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#184e77',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
