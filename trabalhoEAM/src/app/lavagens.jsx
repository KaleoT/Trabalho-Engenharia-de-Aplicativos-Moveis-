import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  TextInput, Button, Text, Title, Card, 
  PaperProvider, MD3DarkTheme, Portal, Modal, IconButton, ActivityIndicator 
} from 'react-native-paper';
import { router } from 'expo-router';

import { 
  collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc, orderBy 
} from 'firebase/firestore';
import { db } from '../config/app-firebase';

export default function LavagensScreen() {
  const [lavagens, setLavagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(false);

  const [idAtual, setIdAtual] = useState(null);
  const [maquina, setMaquina] = useState('');
  const [ciclo, setCiclo] = useState('');

  useEffect(() => {
    const q = query(collection(db, "lavagens"), orderBy("dataCriacao", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setLavagens(lista);
      setLoading(false);
    }, (error) => {
      console.error(error);
      Alert.alert("Erro", "Erro ao carregar lavagens.");
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  const abrirNovo = () => {
    setEditando(false);
    setIdAtual(null);
    setMaquina('');
    setCiclo('');
    setModalVisible(true);
  };

  const prepararEdicao = (item) => {
    setEditando(true);
    setIdAtual(item.id);
    setMaquina(item.maquina);
    setCiclo(item.ciclo);
    setModalVisible(true);
  };

  const salvarLavagem = async () => {
    if (!maquina || !ciclo) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      if (editando) {

        const docRef = doc(db, "lavagens", idAtual);
        await updateDoc(docRef, {
          maquina: maquina,
          ciclo: ciclo
        });
        alert("Lavagem atualizada!");
      } else {

        await addDoc(collection(db, "lavagens"), {
          maquina: maquina,
          ciclo: ciclo,
          status: "Em andamento",
          dataCriacao: new Date()
        });
        alert("Lavagem adicionada com sucesso!");
      }
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar: " + error.message);
    }
  };

  const excluirLavagem = (id, nomeMaquina) => {
    Alert.alert(
      "Excluir Lavagem",
      `Deseja realmente remover a lavagem da ${nomeMaquina}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "lavagens", id));
              alert("Lavagem excluída!");
            } catch (error) {
              console.error(error);
              alert("Erro ao excluir.");
            }
          } 
        }
      ]
    );
  };

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <IconButton icon="logout" iconColor="#FF3B30" onPress={() => router.replace('/')} />
          <Title style={styles.titulo}>Scan Wash</Title>
          <IconButton icon="account-circle" iconColor="#fff" onPress={() => router.push('/perfil')} />
        </View>

        <Text style={styles.subtitulo}>Gerenciamento de Lavagens Activas</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 50 }} />
        ) : lavagens.length === 0 ? (
          <Text style={styles.textoVazio}>Nenhuma lavagem em andamento. Clique no botão abaixo para iniciar!</Text>
        ) : (
          <ScrollView style={styles.lista}>
            {lavagens.map((item) => (
              <Card key={item.id} style={styles.card}>
                <Card.Content>
                  <Title style={styles.cardTitulo}>{item.maquina}</Title>
                  <Text style={styles.cardTexto}>Ciclo: {item.ciclo}</Text>
                  <Text style={styles.cardStatus}>Status: {item.status}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button textColor="#2196F3" onPress={() => prepararEdicao(item)}>Editar</Button>
                  <Button textColor="#FF3B30" onPress={() => excluirLavagem(item.id, item.maquina)}>Excluir</Button>
                </Card.Actions>
              </Card>
            ))}
          </ScrollView>
        )}

        <Button 
          mode="contained" 
          icon="plus" 
          style={styles.fab} 
          onPress={abrirNovo}
        >
          Nova Lavagem
        </Button>

        <Portal>
          <Modal 
            visible={modalVisible} 
            onDismiss={() => setModalVisible(false)} 
            contentContainerStyle={styles.modalContainer}
          >
            <Title style={styles.modalTitulo}>
              {editando ? 'Editar Lavagem' : 'Nova Lavagem'}
            </Title>
            
            <TextInput
              label="Número/Nome da Máquina"
              mode="outlined"
              value={maquina}
              onChangeText={setMaquina}
              style={styles.input}
              textColor="#fff"
            />
            
            <TextInput
              label="Tipo de Ciclo (Ex: Pesado, Rápido)"
              mode="outlined"
              value={ciclo}
              onChangeText={setCiclo}
              style={styles.input}
              textColor="#fff"
            />
            
            <Button mode="contained" onPress={salvarLavagem} style={styles.botaoSalvar}>
              {editando ? 'Atualizar' : 'Salvar Lavagem'}
            </Button>
            <Button mode="text" onPress={() => setModalVisible(false)} textColor="#FF3B30">
              Cancelar
            </Button>
          </Modal>
        </Portal>

      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  titulo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  textoVazio: {
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 30,
    fontSize: 16,
  },
  lista: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    marginBottom: 15,
  },
  cardTitulo: {
    color: '#2196F3',
    fontSize: 20,
  },
  cardTexto: {
    color: '#fff',
    marginTop: 5,
  },
  cardStatus: {
    color: '#4CAF50',
    marginTop: 5,
    fontWeight: 'bold',
  },
  fab: {
    margin: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 5,
  },
  modalContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitulo: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#333',
  },
  botaoSalvar: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    marginBottom: 10,
  }
});
