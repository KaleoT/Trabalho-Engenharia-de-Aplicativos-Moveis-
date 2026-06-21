import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Title, PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { router } from 'expo-router';

// Importando as ferramentas mágicas do Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/app-firebase';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Controla o ícone de carregamento

  const fazerCadastro = async () => {
    // Validação básica
    if (!nome || !email || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    setLoading(true);
    
    try {
      // 1. Cria a conta de e-mail e senha no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // 2. Salva o Nome e uma foto padrão no banco de dados Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nome,
        email: email,
        foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        dataCriacao: new Date()
      });

      alert("Conta criada com sucesso!");
      router.back(); // Manda o usuário de volta para a tela de Login

    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <View style={styles.container}>
        <Title style={styles.titulo}>Criar Conta</Title>
        <Text style={styles.subtitulo}>Cadastre-se para usar o Scan Wash</Text>

        <TextInput
          label="Nome Completo"
          mode="outlined"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          textColor="#fff"
        />

        <TextInput
          label="E-mail"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          textColor="#fff"
        />

        <TextInput
          label="Senha"
          mode="outlined"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
          textColor="#fff"
        />

        <Button 
          mode="contained" 
          onPress={fazerCadastro} 
          style={styles.botao}
          loading={loading}
          disabled={loading}
        >
          Cadastrar
        </Button>

        <Button 
          mode="text" 
          onPress={() => router.back()} 
          style={styles.botaoTexto}
          icon="arrow-left"
          textColor="#2196F3"
        >
          Já tenho uma conta. Fazer Login
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  titulo: {
    textAlign: 'center',
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitulo: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
  },
  botao: {
    marginTop: 10,
    paddingVertical: 5,
    backgroundColor: '#2196F3',
  },
  botaoTexto: {
    marginTop: 15,
  }
});