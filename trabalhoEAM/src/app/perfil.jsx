import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  TextInput, Button, Text, Title, Avatar, 
  PaperProvider, MD3DarkTheme, ActivityIndicator 
} from 'react-native-paper';
import { router } from 'expo-router';

import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser, signOut } from 'firebase/auth';
import { auth, db } from '../config/app-firebase';

export default function PerfilScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [foto, setFoto] = useState('');
  
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPerfil = async () => {
      const usuarioLogado = auth.currentUser;
      
      if (usuarioLogado) {
        setEmail(usuarioLogado.email);
        
        try {

          const docRef = doc(db, "usuarios", usuarioLogado.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setNome(docSnap.data().nome);
            setFoto(docSnap.data().foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
          }
        } catch (error) {
          console.error("Erro ao buscar perfil:", error);
        }
      } else {
     
        router.replace('/');
      }
      setLoading(false);
    };

    carregarPerfil();
  }, []);

  const salvarAlteracoes = async () => {
    setLoading(true);
    try {
      const usuarioLogado = auth.currentUser;
      const docRef = doc(db, "usuarios", usuarioLogado.uid);
      
      await updateDoc(docRef, {
        nome: nome,
        foto: foto
      });
      
      alert("Perfil atualizado com sucesso!");
      setEditando(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const excluirConta = () => {
    Alert.alert(
      "Atenção!",
      "Tem certeza que deseja excluir sua conta permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              const usuarioLogado = auth.currentUser;
              
           
              await deleteDoc(doc(db, "usuarios", usuarioLogado.uid));
            
              await deleteUser(usuarioLogado);
              
              alert("Conta excluída com sucesso.");
              router.replace('/');
            } catch (error) {
              console.error(error);
              alert("Erro ao excluir conta. Você pode precisar fazer login novamente para realizar esta ação.");
            }
          } 
        }
      ]
    );
  };

  const fazerLogout = async () => {
    await signOut(auth);
    router.replace('/');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.titulo}>Meu Perfil</Title>

        <View style={styles.avatarContainer}>
          {foto ? (
            <Avatar.Image size={100} source={{ uri: foto }} />
          ) : (
            <Avatar.Icon size={100} icon="account" />
          )}
        </View>

        <TextInput
          label="Nome"
          mode="outlined"
          value={nome}
          onChangeText={setNome}
          disabled={!editando}
          style={styles.input}
          textColor="#fff"
        />

        <TextInput
          label="E-mail"
          mode="outlined"
          value={email}
          disabled
          style={styles.input}
          textColor="#fff"
        />

        {editando && (
          <TextInput
            label="URL da Foto de Perfil"
            mode="outlined"
            value={foto}
            onChangeText={setFoto}
            style={styles.input}
            textColor="#fff"
          />
        )}
        {!editando ? (
          <Button mode="contained" onPress={() => setEditando(true)} style={styles.botaoEditar}>
            Editar Perfil
          </Button>
        ) : (
          <Button mode="contained" onPress={salvarAlteracoes} style={styles.botaoSalvar}>
            Salvar Alterações
          </Button>
        )}

        <Button mode="contained" buttonColor="#FF3B30" onPress={excluirConta} style={styles.botaoExcluir}>
          Excluir Minha Conta
        </Button>

        <Button mode="text" onPress={() => router.push('/lavagens')} style={styles.botaoVoltar} textColor="#2196F3">
          Voltar para Lavagens
        </Button>

        <Button mode="text" onPress={fazerLogout} textColor="#aaa" style={{ marginTop: 10 }}>
          Sair do Aplicativo (Logout)
        </Button>

      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#000000',
    paddingTop: 50,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
  },
  botaoEditar: {
    marginTop: 10,
    backgroundColor: '#2196F3',
  },
  botaoSalvar: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
  },
  botaoExcluir: {
    marginTop: 15,
  },
  botaoVoltar: {
    marginTop: 20,
  },
});