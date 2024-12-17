import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import database from '@react-native-firebase/database';

// Function to get the current date in 'YYYY-MM-DD' format
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `0${today.getMonth() + 1}`.slice(-2); // Ensure 2 digits for month
  const day = `0${today.getDate()}`.slice(-2); // Ensure 2 digits for day
  return `${year}-${month}-${day}`;
};

// Function to convert time string "HH:mm" to total minutes
const timeToMinutes = timeString => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const DarshanScreen = () => {
  const [data, setData] = useState([]);
  const currentDate = getCurrentDate();

  // Function to fetch data from Firebase for the current date
  const fetchData = () => {
    const reference = database().ref(`Darshan/${currentDate}`);

    reference.once(
      'value',
      snapshot => {
        const data = snapshot.val();

        if (data) {
          const dataList = Object.keys(data).map(key => data[key]);

          // Sort by openingTime in ascending order
          dataList.sort(
            (a, b) =>
              timeToMinutes(a.openingTime) - timeToMinutes(b.openingTime),
          );

          setData(dataList);
        } else {
          setData([]); // Set an empty array if no data is found
        }
      },
      error => {
        console.error('Error fetching data: ', error);
      },
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Render the table rows
  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.openingTime}</Text>
      <Text style={styles.cell}>{item.closingTime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Darshan Details for {currentDate}</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Darshan</Text>
          <Text style={styles.headerCell}>Opening Time</Text>
          <Text style={styles.headerCell}>Closing Time</Text>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6ffe6',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#d4edda',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c3e6cb',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#c3e6cb',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default DarshanScreen;
