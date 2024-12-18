import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TravelSpot from "./TravelSpot";
import styles from "./DetailedSchedule.module.css";
import { loadDetailedPlan } from "../api/savePlanApi";

const DetailedSchedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itinerary, places: chatPlaces } = location.state || {};
  const [itineraryDays, setItineraryDays] = useState([]);
  const [activeDay, setActiveDay] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleDataProcessing = async () => {
    let placesData = {};
    let isChatData = false;
    const imageMapping = {
      황우지해안:
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdDdOWpJUNQJy-60SccLIhgElDKPvhoXgQ4heqyyP1kl9ZACLtIEQoqsuTFJmGO6TpLvfj011NF7TEA5pJWJkiABZDUrDTT7hv8y8L2D-5Yqjrk0A2AEZzzDRsEW4q76NQPGvV14x3yv_dMUtLYDObvVEStv7UWLkHxoaMoUJRyHYu8bZw0O&key=AIzaSyBenOSRj_n3bCTZcdqOmqnnBmCEsi1kOyI",
      동산관광농원:
        "https://img1.kakaocdn.net/cthumb/local/R0x420.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Fcfile%2F1906EC454F717C0D05",
      국수문화거리:
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdDdOWrt7FbbMaQ5I8WvHX0aVC4jKq5AE8vXN3eGxyFcMo37rp04V_nZNDdbVwy36SMb3G9iAefH74aRSwOXY1PM6XV0QIdzFe6_GVqb4FFyEsgdmlz7uSDUC4ht6DTaNY-Yr9dxCBu3peYZeA1K6D7P4Q8rtzkzEkVrCYX4dKiLQFGiECuN&key=AIzaSyBenOSRj_n3bCTZcdqOmqnnBmCEsi1kOyI",
      관덕정성지:
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdDdOWohGU_p7dLOYPled12cR8gct9WyD55JD6NK2iLww_mssegWiCNRAQVe7khamIGTIPkhg2rcEKGWRX7RouXLKMOEabvhM56OQhI3bfD5hrVn0uEeCVIU37D63BuSQJ_hgFRdzagONRPNOqedtIDhG0qxkxonI_6yq3nOAI92VIFhFv0_&key=AIzaSyBenOSRj_n3bCTZcdqOmqnnBmCEsi1kOyI",
      제주민속관광타운:
        "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=AdDdOWrJVYvkRNj22WQQN1DiFZf8Yrz4Kc6Lqeog2CcVRrXgADC4T8FAIfxlC3r9Z5UmtyqKa19UZXNG2MERP-YPfJkDox3IruuK3hJsa1LLoedLLNWNupqCj2iJ6yhR83pYl9DtiF65T_yewNSJs4eDPb299nepoUMQvXIZO4gDX4MXpcv7&key=AIzaSyBenOSRj_n3bCTZcdqOmqnnBmCEsi1kOyI",
      제주허브동산:
        "https://lh5.googleusercontent.com/p/AF1QipP7lNiMllNOcG8FC3DqALuO3HMBv30ylFMyZoAx=w408-h306-k-no",
      한라산탐방로:
        "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxODEwMjJfMjM2%2FMDAxNTQwMjA5NTEyOTUw.xIjeYzYHUYjtuSpnMOsbtrx9LhoTTaOb8oHkZgS-Rfwg.sG8Fo8Qz4skIqCzxUWWHQPvWq5pNKVZ5-ompCipqZfQg.JPEG.kokage1120%2FP1970602.jpg%23591x886",
      "호루의 한끼":
        "https://lh5.googleusercontent.com/p/AF1QipPoEvEX9rTCdXoxzYJ8OzNJ4XfhJXZTduXPr4mJ=w426-h240-k-no",
      동백동산:
        "https://lh5.googleusercontent.com/p/AF1QipMnuHsgty_PkqBF_ewJfoUVzQ-WwmBtYDZLuVW1=w408-h272-k-no",
      서빈백사해수욕장:
        "https://lh5.googleusercontent.com/p/AF1QipNoXRQjxaZ3sPpU9t6cgSt2jGWPsTtPA1e0En6c=w408-h306-k-no",
      "형과 아우(한얼식당)":
        "https://lh5.googleusercontent.com/p/AF1QipNlQahXghvLQE2c1sS77OoTBYrZtpSZwp0L8X7u=w408-h905-k-no",
      교래생태체험장:
        "https://lh5.googleusercontent.com/p/AF1QipMJrMPZN3qMRV9O_5IuSw5Hy9FjRAupVvYIDZZL=w533-h240-k-no",
      천지연기정길:
        "https://lh5.googleusercontent.com/p/AF1QipOAkhVKrq3broFnCMCx4sdqm45jxANDfoC2k3bi=w426-h240-k-no",
      "Cafe Gyulkkot Darak":
        "https://lh5.googleusercontent.com/p/AF1QipODfr1-46iW-luojJPPZ8v0ruhnexsiHVTSnkZP=w408-h306-k-no",
      협재관광지:
        "https://lh5.googleusercontent.com/p/AF1QipNFmem5tBp7EDwMWE2eUNzWkwbvMUnsuenKD7Na=w408-h306-k-no",
      표선우동가게:
        "https://lh5.googleusercontent.com/p/AF1QipNsiy4JqSDNepPKRhYM2mUlrA574x8QhGBvY8iO=w408-h306-k-no",
      사라봉공원:
        "https://lh5.googleusercontent.com/p/AF1QipP86pLgM-W16NUUbSG-hTGtIIsNOs57zTrrCGso=w408-h306-k-no",
      "각 is in 별":
        "https://lh5.googleusercontent.com/p/AF1QipOmfRYtUXu6rDXj1dSTsnps2SjX5vlvTz7etcCS=w519-h240-k-no",
      곽지관광지:
        "https://lh5.googleusercontent.com/p/AF1QipP3sRGK46ajzwD3kKvhqYNyGJDFL5pJL8FDrVQc=w408-h306-k-no",
    };
    if (chatPlaces) {
      console.log("Processing Chat Data");
      placesData = chatPlaces;
      isChatData = true;
    } else if (itinerary?.title) {
      console.log("Processing Saved Itinerary Data");
      const userId = localStorage.getItem("userId");
      const travelName = itinerary.title;

      if (!userId || !travelName) {
        setErrorMessage("사용자 ID 또는 여행 이름이 누락되었습니다.");
        navigate("/mypage");
        setIsLoading(false);
        return;
      }

      try {
        const response = await loadDetailedPlan(userId, travelName);
        placesData = response?.plan?.places || {};
        isChatData = false;
      } catch (error) {
        console.error("Error loading saved itinerary data:", error);
        setErrorMessage("데이터를 불러오는 중 오류가 발생했습니다.");
        navigate("/mypage");
        setIsLoading(false);
        return;
      }
    } else {
      setErrorMessage("데이터를 불러올 수 없습니다.");
      navigate("/mypage");
      setIsLoading(false);
      return;
    }

    console.log("Places Data Before Formatting:", placesData);

    const formattedData = Object.entries(placesData).map(
      ([dayKey, dayData], index) => {
        const spotArray = Array.isArray(dayData)
          ? dayData
          : Array.isArray(dayData?.spots)
            ? dayData.spots
            : [];

        const validSpots = spotArray.map((spot, idx) => {
          if (!spot || typeof spot !== "object") {
            console.error(`Invalid spot at index ${idx}:`, spot);
            return {
              name: "이름 없음",
              category: "카테고리 없음",
              address: "주소 정보 없음",
              imageUrl: null, // 기본 이미지 없음 처리
            };
          }

          const address =
            isChatData && spot.address
              ? spot.address
              : spot.location || "주소 정보 없음";

          return {
            name: spot.name || "이름 없음",
            category: spot.category || "카테고리 없음",
            address,
            imageUrl: imageMapping[spot.name] || spot.imageUrl || null, // 매핑된 이미지 URL 적용
          };
        });

        return {
          displayDay: index + 1,
          originalDay: dayKey.replace(/[^0-9]/g, ""),
          spots: validSpots,
        };
      }
    );

    console.log("Formatted itinerary days:", formattedData);

    if (formattedData.length > 0) {
      setItineraryDays(formattedData);
      setActiveDay(formattedData[0]?.displayDay || null);
    } else {
      setErrorMessage("일정 데이터가 없습니다.");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    handleDataProcessing();
  }, [chatPlaces, itinerary, navigate]);

  return (
    <div className={styles.detailedSchedule}>
      {isLoading ? (
        <p>일정을 불러오는 중입니다...</p>
      ) : errorMessage ? (
        <p className={styles.error}>{errorMessage}</p>
      ) : (
        <>
          <div className={styles.tabs}>
            {itineraryDays.map((day) => (
              <button
                key={day.displayDay}
                className={`${styles.tabButton} ${
                  activeDay === day.displayDay ? styles.active : ""
                }`}
                onClick={() => setActiveDay(day.displayDay)}
              >
                {`${day.displayDay}일차`}
              </button>
            ))}
          </div>
          <div className={styles.spotList}>
            {itineraryDays
              .find((day) => day.displayDay === activeDay)
              ?.spots.map((spot, idx) => (
                <TravelSpot
                  key={idx}
                  spotData={{
                    name: spot.name,
                    category: spot.category,
                    address: spot.address,
                    imageUrl: spot.imageUrl, // imageUrl 전달
                  }}
                />
              )) || <p>해당 일정에 여행지가 없습니다.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default DetailedSchedule;
