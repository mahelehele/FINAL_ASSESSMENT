import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import colors from '../../theme/colors';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { createUserProfile } from '../../firebase/firestoreService';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Create user with Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      
      // Update display name in Auth
      await updateProfile(user, { 
        displayName: name.trim() 
      });
      
      // Create user profile in Firestore
      await createUserProfile({ 
        uid: user.uid, 
        name: name.trim(), 
        email: user.email 
      });
      
      console.log('User created successfully:', {
        uid: user.uid,
        name: name.trim(),
        email: user.email
      });
      
      // Navigate to main app
      navigation.replace('MainApp');
    } catch (err) {
      console.error('Sign up error', err);
      alert(err?.message || 'Failed to create account');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/LOGO/120x120.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <Image 
            source={require('../../../assets/images/05-Sign up Page/google 1.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Sign up with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image 
            source={require('../../../assets/images/05-Sign up Page/vuesax_bold_apple.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Sign up with Apple</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.linkText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  socialButtons: {
    marginVertical: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignUp;