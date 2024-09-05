import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useState} from 'react';
import Icon2 from 'react-native-vector-icons/Entypo';
import {COLORS} from '../../../../../constants/themes';

const Privacy = ({setPrivacyPage}) => {
  const [checkBox, setCheckBox] = useState(false);

  const privacyData = [
    {
      id: 1,
      heading: 'Information We Collect',
      text: 'We only collect information about you if we have a reason to do so–for example, to provide our services, to communicate with you, or to make our services better.',
      points: [
        'Personal Information you provide to us, such as your name, address, phone number, and email address',
        'Information automatically collected when you use our services, such as your IP address, device information, and location information',
        'Location information when you use our services, such as location information either provided by a mobile device interacting with one of our services, or associated with your IP address, where we are permitted by law to process this information',
      ],
    },
    {
      id: 2,
      heading: 'How We Use Your Information',
      text: 'We may use the information we collect in various ways, including:',
      points: [
        'Providing and improving our services.',
        'Communicating with you and responding to your inquiries.',
        'Customizing your experience and delivering personalized content.',
        'Analyzing trends and user behavior to optimize our App.',
      ],
    },
    {
      id: 3,
      heading: 'Information Sharing',
      text: 'We may share your information in certain circumstances, including:',
      points: [
        'With your consent',
        'To comply with legal obligations or lawful requests',
        ' To protect the rights, property, or safety of RentSpace, our users, or others.',
        'In connection with a merger, acquisition, or sale of assets',
      ],
    },
    {
      id: 4,
      heading: 'Data Security',
      text: 'We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, please note that no method of transmission over the internet or electronic storage is 100% secure.',
      points: [],
    },
    {
      id: 5,
      heading: 'Data Retention',
      text: 'We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Your Rights: You may have certain rights regarding your personal information, including the right to access, update, or delete your information. Please contact us if you wish to exercise any of these rights',
      points: [],
    },
    {
      id: 6,
      heading: 'Children’s Privacy',
      text: 'Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe we have collected information about a child, please contact us so that we can take appropriate action.',
      points: [],
    },
    {
      id: 7,
      heading: 'Changes to this Policy',
      text: 'We may update this Privacy Policy from time to time. If we make any material changes, we will notify you by posting the new Privacy Policy on our website. You are advised to review this Privacy Policy periodically for any changes.',
      points: [],
    },
    {
      id: 8,
      heading: 'Contact Us',
      text: 'If you have any questions or concerns about our Privacy Policy, please contact us at [Contact Email Address]',
      points: [],
    },
  ];

  return (
    <View style={{backgroundColor:COLORS.mainGrey}}>
      <TouchableOpacity
        style={styles.exiticon}
        onPress={() => setPrivacyPage(false)}>
        <Icon2
          color={COLORS.black}
          name="chevron-left"
          size={25}
          style={{marginLeft: 5}}
        />
      </TouchableOpacity>
      <ScrollView
        style={styles.container}
        ScontentContainerStyle={styles.contentContainer}>
        <View>
          <Text style={styles.mainHeading}>Privacy Policy</Text>
          <Text style={styles.mainText}>
            Welcome to RentSpace! This Privacy Policy describes how RentSpace
            collects, uses, and discloses your personal information when you use
            our mobile application, website, and services. By accessing or using
            our App, you agree to the collection, use, and disclosure of your
            personal information as described in this Privacy Policy.
          </Text>
          <View style={styles.hr}></View>
        </View>

        <View>
          {privacyData.map((data, index) => (
            <View key={index}>
              <Text style={styles.subHeading}>{data.heading}</Text>
              <Text style={styles.subText}>{data.text}</Text>

              {data.points.map((item, index) => (
                <View style={styles.listings}>
                  <Icon2 name="dot-single" size={20} />
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* <View style={styles.checkBoxContainer}>
          <TouchableOpacity
            style={checkBox ? styles.checkBoxActive : styles.checkBox}
            onPress={() => setCheckBox(!checkBox)}>
            {checkBox ? (
              <Icon2
                name="check"
                size={15}
                style={{color: COLORS.mainPurple}}
              />
            ) : null}
          </TouchableOpacity>
          <Text style={styles.checkBoxText}>
            By using our App, you acknowledge that you have read, understood,
            and agree to be bound by this Privacy Policy.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setPrivacyPage(false)}>
          <Text style={styles.btnText}>I agree</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  exiticon: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  container: {
    paddingHorizontal: 20,
    width: '100%',
    marginBottom:60
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
  },

  mainHeading: {
    fontSize: 25,
    fontWeight: '400',
    color: 'black',
    marginTop: 20,
    marginBottom: 10,
  },

  mainText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'black',
    marginLeft: 10,
    textAlign: 'justify',
  },

  hr: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 15,
    marginBottom: 10,
  },

  subHeading: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
  },

  subText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'grey',
    textAlign: 'justify',
    marginVertical: 5,
  },

  listings: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 2,
  },

  itemText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'grey',
    textAlign: 'justify',
    width: '93.5%',
  },

  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.mainPurple,
    borderRadius: 3,
    top: 5,
  },

  checkBoxActive: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.mainPurple,
    // backgroundColor: COLORS.mainPurple,
    borderRadius: 3,
    top: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  checkBoxContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginVertical: 10,
  },

  checkBoxText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'black',
    textAlign: 'justify',
    width: '92%',
  },

  button: {
    backgroundColor: COLORS.mainPurple,
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 50,
  },

  btnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
