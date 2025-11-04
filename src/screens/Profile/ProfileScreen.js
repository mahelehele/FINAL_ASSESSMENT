import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../theme/colors';
import { auth, storage } from '../../firebase/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { getUserProfile, getBookings, updateUserProfile } from '../../firebase/firestoreService';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setUser(null);
        return;
      }

      const [profile, bookings] = await Promise.allSettled([
        getUserProfile(currentUser.uid),
        getBookings(currentUser.uid)
      ]);

      const userData = {
        uid: currentUser.uid,
        name: profile.value?.name || currentUser.displayName || 'Guest',
        email: profile.value?.email || currentUser.email || '',
        avatar: profile.value?.avatar || currentUser.photoURL || null,
        bookings: bookings.value || [],
      };

      setUser(userData);
      setNameInput(userData.name);
    } catch (error) {
      console.error('Failed to load user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const authUnsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadUserData();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    const focusUnsubscribe = navigation.addListener('focus', loadUserData);

    return () => {
      authUnsubscribe();
      focusUnsubscribe();
    };
  }, [loadUserData, navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('SignIn');
    } catch (error) {
      console.error('Failed to logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const pickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'Please sign in to change avatar');
        return;
      }

      setUploading(true);
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();
      
      const avatarRef = storageRef(storage, `avatars/${currentUser.uid}_${Date.now()}.jpg`);
      await uploadBytes(avatarRef, blob);
      const downloadURL = await getDownloadURL(avatarRef);

      // Update both auth profile and firestore
      await Promise.all([
        updateProfile(currentUser, { photoURL: downloadURL }),
        updateUserProfile(currentUser.uid, { 
          avatar: downloadURL, 
          name: user?.name || currentUser.displayName 
        })
      ]);

      // Update local state
      setUser(prev => prev ? { ...prev, avatar: downloadURL } : null);
      
    } catch (error) {
      console.error('Avatar upload failed:', error);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const saveName = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !nameInput.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    try {
      const trimmedName = nameInput.trim();
      await Promise.all([
        updateProfile(currentUser, { displayName: trimmedName }),
        updateUserProfile(currentUser.uid, { name: trimmedName })
      ]);

      setUser(prev => prev ? { ...prev, name: trimmedName } : null);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update name:', error);
      Alert.alert('Error', 'Failed to update name. Please try again.');
    }
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <Text style={styles.hotelName}>{item.hotelName}</Text>
      <Text style={styles.bookingDates}>
        {item.checkIn} → {item.checkOut} • {item.nights} nights
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No user found. Please sign in.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('SignIn')}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickAvatar} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Image 
              source={ 
                user?.avatar 
                  ? { uri: user.avatar } 
                  : require('../../../assets/images/06-Explore Page/profile-1 copy.png') 
              } 
              style={styles.avatar} 
            />
          )}
        </TouchableOpacity>

        {editing ? (
          <View style={styles.editContainer}>
            <TextInput 
              value={nameInput}
              onChangeText={setNameInput}
              style={styles.nameInput}
              placeholder="Enter your name"
              autoFocus
            />
            <View style={styles.editButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={saveName}
                disabled={!nameInput.trim()}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => {
                  setEditing(false);
                  setNameInput(user.name);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Name</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Bookings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Bookings</Text>
        {user.bookings && user.bookings.length > 0 ? (
          <FlatList
            data={user.bookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.noBookingsText}>You have no bookings yet.</Text>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.text,
    textAlign: 'center',
  },
  email: {
    color: colors.muted,
    marginBottom: 10,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 8,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  editContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    width: '100%',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 80,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.muted,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flex: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
    color: colors.text,
  },
  bookingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hotelName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: colors.text,
  },
  bookingDates: {
    color: colors.muted,
    fontSize: 14,
  },
  noBookingsText: {
    color: colors.muted,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  logoutButton: {
    backgroundColor: colors.danger,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 10,
    color: colors.muted,
  },
  errorText: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfileScreen;