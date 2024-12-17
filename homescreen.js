import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import database from '@react-native-firebase/database';
import moment from 'moment'; // To handle time

const HomeScreen = () => {
  const [imageUrl, setImageUrl] = useState(null); // Set initial value to null
  const [loading, setLoading] = useState(true); // To show a loader while fetching
  const [darshanData, setDarshanData] = useState({}); // Store all Darshan data

  // Fetch all Darshan data from Firebase Realtime Database
  const fetchDarshanData = async () => {
    const darshanRef = database().ref('Darshan');
    darshanRef.on('value', snapshot => {
      const data = snapshot.val();
      setDarshanData(data); // Store all Darshan data
      setLoading(false); // Hide loader once the data is fetched
      updateImageBasedOnTime(data); // Update image immediately based on time
    });
  };

  // Function to update image based on current time
  const updateImageBasedOnTime = (data) => {
    const currentTime = moment().format('HH:mm'); // Get current time in HH:mm format

    // Iterate through Darshan data to find matching opening time
    let foundImage = null;
    for (let key in data) {
      const darshan = data[key];
      if (darshan.openingTime && darshan.openingTime <= currentTime && darshan.closingTime >= currentTime) {
        foundImage = darshan.image; // Set image URL for the matching darshan
        break;
      }
    }

    if (foundImage) {
      setImageUrl(foundImage); // Update image URL in state
    }
  };

  useEffect(() => {
    // Fetch Darshan data on component mount
    fetchDarshanData();

    // Set an interval to check and update the image every minute
    const intervalId = setInterval(() => {
      updateImageBasedOnTime(darshanData); // Update image based on current time
    }, 60000); // Update every minute (adjust as needed)

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [darshanData]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator
      ) : imageUrl ? (
        <ImageBackground 
          source={{ uri: imageUrl }} 
          style={styles.backgroundImage}
        >
          {/* Other components */}
        </ImageBackground>
      ) : (
        <ImageBackground 
          source={require('./assets/main.png')} // Default or placeholder image
          style={styles.backgroundImage}
        >
          {/* Other components */}
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default HomeScreen;
