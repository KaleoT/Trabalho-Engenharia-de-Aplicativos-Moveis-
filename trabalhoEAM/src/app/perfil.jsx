import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Title, Avatar, PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { router } from 'expo-router';

export default function PerfilScreen() {
  // Simulando os dados do usuário que virão do Firebase
  const [nome, setNome] = useState('Usuário Teste');
  const [email, setEmail] = useState('usuario@pucminas.br');
  const [foto, setFoto] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');
  const [editando, setEditando] = useState(false);

  const salvarAlteracoes = () => {
    setEditando(false);
    console.log("Dados atualizados (UPDATE):", nome, foto);
  };

  const excluirConta = () => {
    console.log("Conta excluída (DELETE)");
    router.replace('/'); // Volta para o Login
  };

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.titulo}>Meu Perfil</Title>

        {/* Foto de Perfil */}
        <View style={styles.avatarContainer}>
          <Avatar.Image size={100} source={{ uri: foto }} />
        </View>

        {/* Exibição / Edição dos dados (READ e UPDATE) */}
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

        {/* Botões do CRUD */}
        {!editando ? (
          <Button mode="contained" onPress={() => setEditando(true)} style={styles.botaoEditar}>
            Editar Dados
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
          Ir para Gestão de Lavagens →
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000', // Fundo estritamente preto
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
    backgroundColor: '#1a1a1a', // Inputs grafite para destacar no preto
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