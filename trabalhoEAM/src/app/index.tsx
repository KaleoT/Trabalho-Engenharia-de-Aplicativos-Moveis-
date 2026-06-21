import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title, PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/app-firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); 

  const fazerLogin = async () => {
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      
      alert("Login realizado com sucesso!");
      
    
      router.replace('/lavagens'); 

    } catch (error) {
      console.error(error);
      alert("Erro ao entrar: Verifique seu e-mail e senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <View style={styles.container}>
        <Title style={styles.titulo}>Scan Wash</Title>
        <Text style={styles.subtitulo}>Faça login para gerenciar suas lavagens</Text>

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
          onPress={fazerLogin} 
          style={styles.botao}
          loading={loading}
          disabled={loading}
        >
          Entrar
        </Button>

        <Button 
          mode="text" 
          onPress={() => router.push('/cadastro')} 
          style={styles.botaoTexto}
          textColor="#2196F3"
        >
          Não tem uma conta? Cadastre-se
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