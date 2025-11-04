import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import colors from '../../theme/colors';
import { getReviews } from '../../firebase/firestoreService';

const HotelDetail = ({ route, navigation }) => {
  const hotel = route?.params?.hotel || {
    name: 'Sample Hotel',
    image: require('../../../assets/images/06-Explore Page/Rectangle 783.png'),
    location: 'Unknown',
    rating: 4.5,
    price: '$120',
    description: 'A lovely place to stay with modern amenities and excellent service.'
  };

  const [reviews, setReviews] = useState([]);
  const [weather, setWeather] = useState(null);

  // Optional: OpenWeatherMap API key (set here or via env). Leave empty to skip.
  const OPENWEATHER_API_KEY = '';

  useEffect(() => {
    let mounted = true;
    const loadWeather = async () => {
      if (!OPENWEATHER_API_KEY) return;
      try {
        // Use hotel.location as the query (may contain city)
        const q = encodeURIComponent(hotel.location || hotel.name || '');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setWeather(data);
      } catch (e) {
        console.warn('Weather fetch failed', e);
      }
    };
    loadWeather();
    return () => { mounted = false; };
  }, [hotel]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!hotel?.id) return;
      try {
        const r = await getReviews(hotel.id);
        if (mounted) setReviews(r);
      } catch (e) {
        console.warn('Failed to load reviews', e);
      }
    };
    load();
    return () => { mounted = false; };
  }, [hotel]);

  return (
    <ScrollView style={styles.container}>
      <Image source={hotel.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{hotel.name}</Text>
        <View style={styles.row}>
          <Text style={styles.location}>{hotel.location}</Text>
          <Text style={styles.rating}>⭐ {hotel.rating}</Text>
        </View>
        <Text style={styles.price}>{hotel.price} <Text style={styles.night}>/night</Text></Text>

        {weather ? (
          <Text style={{ marginTop: 8, color: colors.muted }}>Weather: {weather.weather?.[0]?.description ?? ''}, {weather.main?.temp}°C</Text>
        ) : null}

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{hotel.description}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('Booking', { hotel })}
          >
            <Text style={styles.bookText}>Book Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => navigation.navigate('AddReview', { hotel })}
          >
            <Text style={styles.reviewText}>Write a Review</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.length === 0 ? (
          <Text style={{ color: colors.muted }}>No reviews yet. Be the first to review!</Text>
        ) : (
          reviews.map((r) => (
            <View key={r.id} style={styles.reviewItem}>
              <Text style={styles.reviewAuthor}>{r.userName}</Text>
              <Text style={styles.reviewRating}>⭐ {r.rating}</Text>
              <Text style={styles.reviewText}>{r.comment}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 260,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    color: colors.muted,
  },
  rating: {
    color: colors.text,
    fontWeight: 'bold',
  },
  price: {
    marginTop: 12,
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  night: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'normal',
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.muted,
    lineHeight: 22,
  },
  reviewItem: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewRating: {
    color: colors.primary,
    marginBottom: 6,
  },
  reviewText: {
    color: colors.muted,
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  bookText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginLeft: 10,
  },
  reviewText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HotelDetail;
