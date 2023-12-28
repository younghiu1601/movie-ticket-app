import * as React from 'react';
import {Text, View, StyleSheet, StatusBar, Image, ScrollView} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import AppHeader from '../components/AppHeader';
import SettingComponent from '../components/SettingComponent';

const UserAccountScreen = ({navigation}: any) => {
  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header={'Thông tin của tôi'}
          action={() => navigation.goBack()}
        />
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require('../assets/image/logo-og.png')}
          style={styles.avatarImage}
        />
        <Text style={styles.avatarText}>Dinh Kien</Text>
      </View>

      <View style={styles.profileContainer}>
        <SettingComponent
          icon="user"
          heading="Tài khoản"
          subheading="Chỉnh sửa"
          subtitle="Đổi mật khẩu"
        />
        <SettingComponent
          icon="setting"
          heading="Cài đặt"
          subheading="Giao diện"
          subtitle="Quyền"
        />
        <SettingComponent
          icon="dollar"
          heading="Đề xuất & Giới thiệu"
          subheading="Đề xuất"
          subtitle="Giới thiệu"
        />
        <SettingComponent
          icon="info"
          heading="Về rạp phim"
          subheading="Phim"
          subtitle="Xem thêm"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Grey,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  profileContainer: {
    alignItems: 'center',
    padding: SPACING.space_36,
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    marginTop: SPACING.space_16,
    color: COLORS.White,
  },
});

export default UserAccountScreen;
