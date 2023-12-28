import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import { COLORS, FONTSIZE, SPACING } from '../theme/theme';
import {
  upcomingMovies,
  nowPlayingMovies,
  popularMovies,
  topRatedMovies,
  baseImagePath,
} from '../api/apicalls';
import InputHeader from '../components/InputHeader';
import CategoryHeader from '../components/CategoryHeader';
import SubMovieCard from '../components/SubMovieCard';
import MovieCard from '../components/MovieCard';
import CustomIcon from '../components/CustomIcon';
const { width, height } = Dimensions.get('window');

const getNowPlayingMoviesList = async () => {
  try {
    let response = await fetch(nowPlayingMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(
      ' Something went wrong in getNowPlayingMoviesList Function',
      error,
    );
  }
};

const getUpcomingMoviesList = async () => {
  try {
    let response = await fetch(upcomingMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(
      ' Something went wrong in getUpcomingMoviesList Function',
      error,
    );
  }
};

const getPopularMoviesList = async () => {
  try {
    let response = await fetch(popularMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(
      ' Something went wrong in getPopularMoviesList Function',
      error,
    );
  }
};

const getTopRatedMoviesList = async () => {
  try {
    let response = await fetch(topRatedMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(
      ' Something went wrong in getUpcomingMoviesList Function',
      error,
    );
  }
};

const HomeScreen = ({ navigation }: any) => {
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState<any>(undefined);
  const [popularMoviesList, setPopularMoviesList] = useState<any>(undefined);
  const [upcomingMoviesList, setUpcomingMoviesList] = useState<any>(undefined);
  const [topRatedMoviesList, setTopRatedMoviesList] = useState<any>(undefined);
  useEffect(() => {
    (async () => {
      let tempNowPlaying = await getNowPlayingMoviesList();
      setNowPlayingMoviesList([
        { id: 'dummy1' },
        ...tempNowPlaying.results,
        { id: 'dummy2' },
      ]);

      let tempPopular = await getPopularMoviesList();
      setPopularMoviesList(tempPopular.results);

      let tempUpcoming = await getUpcomingMoviesList();
      setUpcomingMoviesList(tempUpcoming.results);

      let tempTopRated = await getTopRatedMoviesList();
      setTopRatedMoviesList(tempTopRated.results);
    })();
  }, []);

  const searchMoviesFunction = () => {
    navigation.navigate('Search');
  };

  if (
    nowPlayingMoviesList == undefined &&
    nowPlayingMoviesList == null &&
    popularMoviesList == undefined &&
    popularMoviesList == null &&
    upcomingMoviesList == undefined &&
    upcomingMoviesList == null &&
    topRatedMoviesList == undefined &&
    topRatedMoviesList == null
  ) {
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}>
        <StatusBar hidden />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'large'} color={COLORS.Green} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <StatusBar hidden />

      {/* <View style={styles.InputHeaderContainer}>
        <InputHeader searchFunction={searchMoviesFunction} />
      </View> */}
    
      <View style={styles.appHeaderContainer}>
        <Image source={require('../assets/image/logo-app.png')} style={styles.logo} />
        <CustomIcon name='video' color={COLORS.White} size={40} />
      </View>

      <CategoryHeader title={'Đang chiếu'} />
      <FlatList
        data={nowPlayingMoviesList}
        keyExtractor={(item: any) => item.id}
        bounces={false}
        snapToInterval={width * 0.7 + SPACING.space_36}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        contentContainerStyle={styles.containerGap36}
        renderItem={({ item, index }) => {
          if (!item.original_title) {
            return (
              <View
                style={{
                  width: (width - (width * 0.7 + SPACING.space_36 * 2)) / 2,
                }}></View>
            );
          }
          return (
            <MovieCard
              shoudlMarginatedAtEnd={true}
              cardFunction={() => {
                navigation.push('MovieDetails', { movieid: item.id });
              }}
              cardWidth={width * 0.7}
              isFirst={index == 0 ? true : false}
              isLast={index == upcomingMoviesList?.length - 1 ? true : false}
              title={item.title}
              imagePath={baseImagePath('w780', item.poster_path)}
              genre={item.genre_ids.slice(1, 4)}
              vote_average={item.vote_average}
              vote_count={item.vote_count}
            />
          );
        }}
      />
      <CategoryHeader title={'Phổ biến'} />
      <FlatList
        data={popularMoviesList}
        keyExtractor={(item: any) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.containerGap36}
        renderItem={({ item, index }) => (
          <SubMovieCard
            shoudlMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.push('MovieDetails', { movieid: item.id });
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.title}
            imagePath={baseImagePath('w342', item.poster_path)}
          />
        )}
      />
      <CategoryHeader title={'Sắp chiếu'} />
      <FlatList
        data={upcomingMoviesList}
        keyExtractor={(item: any) => item.id}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerGap36}
        renderItem={({ item, index }) => (
          <SubMovieCard
            shoudlMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.push('MovieDetails', { movieid: item.id });
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.title}
            imagePath={baseImagePath('w342', item.poster_path)}
          />
        )}
      />

      <CategoryHeader title={'Đánh giá cao nhất'} />
      <FlatList
        data={topRatedMoviesList}
        keyExtractor={(item: any) => item.id}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerGap36}
        renderItem={({ item, index }) => (
          <SubMovieCard
            shoudlMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.push('MovieDetails', { movieid: item.id });
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == topRatedMoviesList?.length - 1 ? true : false}
            title={item.title}
            imagePath={baseImagePath('w342', item.poster_path)}
          />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: COLORS.Grey,
  },
  scrollViewContainer: {
    flex: 1,
  },
  appHeaderContainer: {
    display: 'flex',
    marginTop: 12,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    height: 50,
    width: 50,
    borderRadius: 100,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  InputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
});

export default HomeScreen;
