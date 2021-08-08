import React from "react";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";

import BarcodeUrl from "../../assets/example-barcode.png";
import font from "../../assets/msyh.ttf";

Font.register({ family: "Alibaba PuHuiTi Light", src: font });

const About = () => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      fontFamily: "Alibaba PuHuiTi Light",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
    },
    section: {
      margin: 0,
      padding: 10,
      width: "50%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      border: "1px solid black",
      //   width: '100%'
    },
    header: {
      fontSize: 12,
      alignSelf: "center",
      marginBottom: 8,
    },
    row: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      justifyConten: "space-between",
      marginVertical: 3,
    },
    desc: {
      fontSize: 10,
      marginVertical: 3,
    },
    rowDesc: {
      width: "50%",
      fontSize: 10,
    },
    img: {
      marginTop: 5,
      height: 0,
      paddingTop: "18%",
      width: "100%",
    },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((key) => (
          <View style={styles.section} key={key}>
            <Text style={styles.header}>國立臺北教育大學</Text>
            <Text style={styles.desc}>財產名稱：實務投影機</Text>
            <View style={styles.row}>
              <Text style={styles.rowDesc}>購置日期：2016-12-02</Text>
              <Text style={styles.rowDesc}>經費來源：校務基金</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowDesc}>使用單位：數位系</Text>
              <Text style={styles.rowDesc}>保管人：許一珍</Text>
            </View>
            <Image style={styles.img} src={BarcodeUrl} />
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <MyDocument />
      </PDFViewer>
    </div>
  );
};

export default About;
