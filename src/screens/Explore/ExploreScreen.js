import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../../firebase/firebase';
import colors from '../../theme/colors';

const ExploreScreen = ({ navigation }) => {
  const popularHotels = [
    { 
      id: '1', 
      name: 'Palazzo Versace',
      image: require('../../../assets/images/06-Explore Page/Rectangle 783.png'),
      location: 'Main Street, New York',
      rating: 4.8,
      price: '$250'
    },
    { 
      id: '2', 
      name: 'Hotel Moonlight',
      image: require('../../../assets/images/06-Explore Page/Rectangle 784.png'),
      location: 'Downtown, San Francisco',
      rating: 4.5,
      price: '$175'
    },
  ];

  const recommendedHotels = [
    { 
      id: '3', 
      name: 'The Plaza Hotel',
      image: require('../../../assets/images/06-Explore Page/Rectangle 785.png'),
      location: 'Fifth Avenue, New York',
      rating: 4.9,
      price: '$400'
    },
    { 
      id: '4', 
      name: 'Luxury Resort & Spa',
      image: require('../../../assets/images/06-Explore Page/Rectangle 786.png'),
      location: 'Beverly Hills, LA',
      rating: 4.7,
      price: '$320'
    },
    { 
      id: '5', 
      name: 'Luxury Resort & Spa',
      image: require('../../../assets/images/06-Explore Page/Rectangle 786.png'),
      location: 'Beverly Hills, LA',
      rating: 4.7,
      price: '$320'
    },
  ];

  const renderHotelItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetail', { hotel: item })}
    >
      <Image source={item.image} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Image 
            source={require('../../../assets/images/06-Explore Page/Maps _ map-pin-2-fill.png')} 
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.ratingPriceContainer}>
          <View style={styles.ratingContainer}>
            <Image 
              source={require('../../../assets/images/06-Explore Page/star.png')} 
              style={styles.starIcon}
            />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.priceText}>{item.price}<Text style={styles.nightText}>/night</Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      // prefer firebase auth user
      const current = auth.currentUser;
      if (current) {
        setUser({ name: current.displayName, avatar: current.photoURL });
        return;
      }
      const value = await AsyncStorage.getItem('user');
      if (value) setUser(JSON.parse(value));
      else setUser(null);
    } catch (e) {
      console.error('Failed to load user in Explore', e);
    }
  };

  useEffect(() => {
    loadUser();
    const unsub = navigation.addListener('focus', loadUser);
    return unsub;
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name ?? 'Guest'}!</Text>
          <Text style={styles.subtitle}>Find your favorite hotel</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image 
            source={ user?.avatar ? { uri: user.avatar } : require('../../../assets/images/06-Explore Page/profile-1 copy.png') } 
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Image 
          source={require('../../../assets/images/06-Explore Page/search.png')} 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels..."
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Hotels</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={popularHotels}
          renderItem={renderHotelItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.hotelsList}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={recommendedHotels}
          renderItem={renderHotelItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.hotelsList}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 50,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  hotelsList: {
    paddingLeft: 20,
  },
  hotelCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  hotelInfo: {
    padding: 15,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  nightText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
  },
});

export default ExploreScreen;