import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, TextInput, Modal, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function App() {
  // Estado para armazenar os alunos para cada título
  const [students, setStudents] = useState({
    student6H: [],
    student7H: [],
    student8H: [],
    student18H: [],
    student19H: [],
    student20H: [],
  });

  // Estado do modal
  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [newStudent, setNewStudent] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  // Função para mostrar o modal
  const showModal = (field) => {
    setCurrentField(field);
    setModalVisible(true);
    setSelectedOption('');
  };

  // Função para adicionar aluno
  const addStudent = () => {
    if (!newStudent.trim()) {
      Alert.alert('Atenção!', 
                  'Por favor, digite o nome do aluno.');
      return;
    }

    if (!selectedOption) {
      Alert.alert('Atenção!', 
                  'Por favor, selecione a modalidade do aluno.');
      return;
    }

    if (students[currentField].length < 17) {
      setStudents({
        ...students,
        [currentField]: [
          ...students[currentField],
          { name: newStudent, option: selectedOption },
        ],
      });
      setModalVisible(false);
      setNewStudent('');
      setSelectedOption('');
    } else {
      Alert.alert('Atenção!',
                  'Máximo de 17 alunos atingido!');
    }
  };

  // Função para remover aluno
  const removeStudent = (field, studentName) => {
    setStudents({
      ...students,
      [field]: students[field].filter((student) => student.name !== studentName),
    });
  };

  // Função para limpar todos os alunos de um horário
  const clearAllStudents = (field) => {
    Alert.alert(
      'Atenção!',
      'Você tem certeza que deseja limpar todos os alunos dessa lista?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            setStudents({
              ...students,
              [field]: [],
            });
          },
        },
      ]
    );
  };

  // Função para limpar o nome do aluno ao clicar em "Cancelar"
  const cancelAddStudent = () => {
    setModalVisible(false);
    setNewStudent('');
    setSelectedOption('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Grade de Horários CrossFit</Text>

      <ScrollView>
        {/* Exibe os campos com horários e ícones + */}
        {Object.keys(students).map((field, index) => {
          const hour = field.replace('student', '').replace('H', 'H:00');
          const studentCount = students[field].length;
          return (
            <View key={index} style={styles.studentRow}>
              {/* Contorno para cada título de horário com lista de alunos e botões */}
              <View style={[styles.hourContainer, styles.hourBorder]}>
                <Text style={styles.hourTitle}>{hour}</Text>
                <Text style={styles.studentCount}>{studentCount} / 17</Text>

                {/* Botões de adicionar aluno e limpar alunos lado a lado */}
                <View style={styles.buttonsContainer}>
                  {/* Botão de adicionar aluno */}
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => showModal(field)}
                  >
                    <Icon name="plus" size={20} color="white" />
                  </TouchableOpacity>

                  {/* Botão de limpar alunos */}
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => clearAllStudents(field)}
                  >
                    <Text style={styles.clearButtonText}>Limpar Alunos</Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de alunos com rolagem e zebrada */}
                <ScrollView style={styles.studentList} contentContainerStyle={{ paddingBottom: 10 }}>
                  {students[field].map((student, idx) => (
                    <View
                      key={idx}
                      style={[styles.studentItem, idx % 2 === 0 && styles.evenRow]} // Estilo de zebra
                    >
                      <Text style={styles.studentName}>{student.name} ({student.option})</Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeStudent(field, student.name)}
                      >
                        <Icon name="minus" size={20} color="red" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal para adicionar aluno */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelAddStudent}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.alunoTitle}>Aluno:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do aluno"
              value={newStudent}
              onChangeText={setNewStudent}
              maxLength={30}
            />
            
            <Text style={styles.optionTitle}>Modalidade do Aluno:</Text>

            <View style={styles.optionButtons}>
              {['WellHub', 'TotalPass', 'Simples', 'Vip'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionButton, selectedOption === option && styles.selectedOptionButton]}
                  onPress={() => setSelectedOption(option)}
                >
                  <Text style={styles.optionButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={addStudent}>
              <Text style={styles.modalButtonText}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={cancelAddStudent}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  studentRow: {
    marginBottom: 20,
  },
  hourContainer: {
    marginBottom: 5,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  hourBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  hourTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5,
  },
  studentCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    marginBottom: 10,
  },
  studentList: {
    flex: 2,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 10,
    maxHeight: 650,
    width: '100%',
    marginTop: 10,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  evenRow: {
    backgroundColor: '#f2f2f2',
  },
  studentName: {
    fontSize: 16,
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#555',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  alunoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#7D7D7D',
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
    width: '40%',
  },
  selectedOptionButton: {
    backgroundColor: '#007BFF',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
