import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import colors from '../../theme/colors';
import { auth } from '../../firebase/firebase';
import { saveReview } from '../../firebase/firestoreService';

const AddReview = ({ route, navigation }) => {
  const hotel = route?.params?.hotel;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([
    require('../../../assets/images/13-All Reviews Page/Rectangle 2564.png'),
    require('../../../assets/images/13-All Reviews Page/Rectangle 2565.png'),
  ]);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Sign in required', 'Please sign in to submit a review', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => navigation.navigate('SignIn') }
      ]);
      return;
    }
    if (!hotel?.id) {
      // If no hotel id available, just go back
      navigation.goBack();
      return;
    }
    const review = {
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      rating,
      comment,
      images: [],
      createdAt: new Date().toISOString(),
    };
    try {
      await saveReview(hotel.id, review);
      Alert.alert('Thanks', 'Your review was submitted');
      navigation.goBack();
    } catch (e) {
      console.error('Failed to save review', e);
      Alert.alert('Error', 'Failed to save review. Try again later.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={ auth.currentUser?.photoURL ? { uri: auth.currentUser.photoURL } : require('../../../assets/images/13-All Reviews Page/profile-1.png') }
          style={styles.profileImage}
        />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{auth.currentUser?.displayName ?? 'You'}</Text>
          <Text style={styles.reviewDate}>Reviewing {hotel?.name ?? 'this hotel'}</Text>
        </View>
      </View>

      <View style={styles.ratingSection}>
        <Text style={styles.ratingTitle}>Rate your experience</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
            >
              <Image 
                source={require('../../../assets/images/06-Explore Page/star.png')}
                style={[
                  styles.starIcon,
                  star <= rating ? styles.starSelected : styles.starUnselected
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Write your review</Text>
        <TextInput
          style={styles.input}
          placeholder="Share your thoughts about your stay..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.photoSection}>
        <Text style={styles.photoTitle}>Add photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
          {images.map((image, index) => (
            <Image key={index} source={image} style={styles.reviewImage} />
          ))}
          <TouchableOpacity style={styles.addPhotoButton}>
            <Text style={styles.addPhotoText}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  ratingSection: {
    marginBottom: 25,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
  },
  starSelected: {
    tintColor: '#FFD700',
  },
  starUnselected: {
    tintColor: '#D1D5DB',
  },
  reviewSection: {
    marginBottom: 25,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    height: 120,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  photoSection: {
    marginBottom: 25,
  },
  photoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  photoList: {
    marginBottom: 15,
  },
  reviewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addPhotoText: {
    fontSize: 30,
    color: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddReview;