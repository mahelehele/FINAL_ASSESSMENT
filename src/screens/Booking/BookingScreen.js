import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../theme/colors';
import { auth } from '../../firebase/firebase';
import { saveBooking } from '../../firebase/firestoreService';

const BookingScreen = ({ route, navigation }) => {
  const hotel = route?.params?.hotel;
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [guests, setGuests] = useState('1');
  const [loading, setLoading] = useState(false);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateForStorage = (date) => {
    return date.toISOString().split('T')[0];
  };

  const calcDays = (startDate, endDate) => {
    const diff = endDate.getTime() - startDate.getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const onCheckInChange = (event, selectedDate) => {
    setShowCheckInPicker(false);
    if (selectedDate) {
      setCheckInDate(selectedDate);
    }
  };

  const onCheckOutChange = (event, selectedDate) => {
    setShowCheckOutPicker(false);
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const handleBook = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Please Sign In', 'You need to sign in to book a hotel.');
      return;
    }

    setLoading(true);

    try {
      const days = calcDays(checkInDate, checkOutDate);
      
      const bookingData = {
        hotelId: hotel?.id || 'unknown',
        hotelName: hotel?.name || 'Unknown Hotel',
        checkIn: formatDateForStorage(checkInDate),
        checkOut: formatDateForStorage(checkOutDate),
        guests: parseInt(guests, 10),
        nights: days,
        bookedAt: new Date().toISOString(),
        status: 'confirmed'
      };

      // Save to Firestore
      await saveBooking(user.uid, bookingData);
      
      // Show success message
      Alert.alert(
        'Booking Confirmed!', 
        `You have successfully booked ${hotel?.name} from ${formatDate(checkInDate)} to ${formatDate(checkOutDate)} for ${guests} guest${guests > 1 ? 's' : ''}.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      Alert.alert('Error', 'Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const days = calcDays(checkInDate, checkOutDate);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book {hotel?.name}</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Check-in Date</Text>
        <TouchableOpacity onPress={() => setShowCheckInPicker(true)}>
          <TextInput
            style={styles.input}
            value={formatDate(checkInDate)}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <Text style={styles.label}>Check-out Date</Text>
        <TouchableOpacity onPress={() => setShowCheckOutPicker(true)}>
          <TextInput
            style={styles.input}
            value={formatDate(checkOutDate)}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>

        <Text style={styles.label}>Number of Guests</Text>
        <TextInput
          style={styles.input}
          value={guests}
          onChangeText={setGuests}
          keyboardType="numeric"
        />

        {showCheckInPicker && (
          <DateTimePicker
            value={checkInDate}
            mode="date"
            onChange={onCheckInChange}
            minimumDate={new Date()}
          />
        )}

        {showCheckOutPicker && (
          <DateTimePicker
            value={checkOutDate}
            mode="date"
            onChange={onCheckOutChange}
            minimumDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)}
          />
        )}

        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={handleBook}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Booking...' : 'Book Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  bookButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingScreen;