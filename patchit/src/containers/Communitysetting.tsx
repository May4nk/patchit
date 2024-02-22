import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../common/hooks/useAuth";

import Htabs from "../components/html/Htabs";
import Patdrop from "../components/html/patdrop/Patdrop";

import { GETCOMMUNITYPREFERENCE } from "./queries/communitysetting"; //queries

//css & types
import "./css/main.css";
import "./css/profilesettings.css";
import { communitySettingTabs } from "../constants/const";
import { authcontexttype } from "../context/types";
import { droppertype, profiletype } from "../components/html/patdrop/types.js";
import {
  profilestatetype,  
  notificationsstatetype,
  privacystatetype,
  communitystatetype,
} from "./types/communitysetting.js";

const Communitysetting = () => {
  const navigate = useNavigate();
  const { cname } = useParams();
  const { user }: authcontexttype = useAuth();
  const userId: number | null = user && (user["user_id"] | user["id"]);

  const [getCommuntySetting, { data, loading }] = useLazyQuery(GETCOMMUNITYPREFERENCE);
  //const [updateUserSettings] = useMutation(UPSERTUSERPREFERENCES);  

  const csettings = !loading && data?.communitypreference;

  //states
  const [userOption, setUserOption] = useState<string>("account");
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [profileState, setProfileState] = useState<profilestatetype>({nsfw: false,});
  const [privacyState, setPrivacyState] = useState<privacystatetype>({allowppltofollow: false,});
  const [communityState, setCommunityState] = useState<communitystatetype>({
    profile_pic: "",
    background_pic: "",
    about: "",
    description: "",
    privacy: ""
  })
  const [notificationsState, setNotificationState] = useState<notificationsstatetype>({
    newuserreq: false,    
    reportonpost: false,
    reportoncmnt: false,
    reportonuser: false,
    activityincommunity: false,    
    birthday: false,
  });

  //handler
  const handleChange: (e: any, statename: string) => void = (e, statename) => {
    setUpdateState(true);
    if (statename === "profile") {
      setProfileState({
        ...profileState,
        [e.target.name]: e.target.checked
      });          
    } else if (statename === "notifications") {
      setNotificationState({
        ...notificationsState,
        [e.target.name]: e.target.checked
      });
    } else if (statename === "privacy") {
      setPrivacyState({
        ...privacyState,
        [e.target.name]: e.target.checked
      });
    }
  }

  const handleUpdateChanges: () => void = () => {
    // updateUserSettings({
    //   variables: {
    //     data: {
    //       user_id: userId,
    //       ...privacyState,
    //       ...notificationsState,          
    //       ...profileState
    //     }
    //   }
    // }).then(() => {
    //   setUpdateState(false);
    // })
  }

  const handleUserOptions: (uoption: string) => void = (uoption) => {
    document.querySelector(`.tab${userOption}`)?.classList?.remove("selected");
    setUserOption(uoption);
    document.querySelector(`.tab${uoption}`)?.classList?.add("selected");
  }

  const handleDeleteAcc: () => void = () => {

  }

  const privacyDropperprofile: profiletype = {
    icn: "lock",
    title: "privacy",    
  };

  const privacyDroppers: droppertype[] = [
    { value: "public", icn: "person_outline", state: "clicked", event: () => setCommunityState({ ...communityState, privacy: "PUBLIC" })},
    { value: "private", icn: "lock_outline", state: "clicked", event: () => setCommunityState({ ...communityState, privacy: "PRIVATE" })},
    { value: "restricted", icn: "no_encryption", state: "clicked", event: () => setCommunityState({ ...communityState, privacy: "RESTRICTED" })}
  ];

  useEffect(() => {
    if (csettings) {             
      setPrivacyState({                
        allowppltofollow: csettings?.allowppltofollow!,
      });
      setProfileState({
        nsfw: csettings?.nsfw!,       
      });
      setCommunityState({
        about: csettings?.community_name?.about,
        description: csettings?.community_name?.description,
        privacy: csettings?.community_name?.privacy,
        profile_pic: "",
        background_pic: ""
      });
      setNotificationState({
        newuserreq: csettings?.newuserreq!,      
        reportonpost: csettings?.reportonpost!,
        reportoncmnt: csettings?.reportoncmnt!,
        reportonuser: csettings?.reportonuser!,        
        activityincommunity: csettings?.activityincommunity!,
        birthday: csettings?.birthday!,      
      });
    }
  }, [csettings]);  

  useEffect(() => {
    if(cname) {
      getCommuntySetting({
        variables: {
          communityName: cname!
        }
      });
    }
  },[cname]);

  useEffect(() => {
    if (!user) {
      navigate("/home");
    } else {
      handleUserOptions("profile");
    }
  }, [user]);

  let pic: string = require("../img/a.jpg");

  return (
    <>
      <div className="useroverviewtitle">
        <i className="material-icons white-text uoverviewicn"> settings </i>
        Community Preferences
      </div>
      <div className="useroverview">
        { communitySettingTabs.map((tab: string, idx: number) => (
          <Htabs
            tabname={ tab }
            handleClick={ () => handleUserOptions(tab) }
            key={ idx }
          />
        ))}
        {updateState && (
          <div className="usettingupdatechangesbtn waves-effect waves-light black-text grey" onClick={handleUpdateChanges}>
            Update
          </div>
        )}
      </div>
      <div className="flexy">
        { userOption === "profile" ? (
          <div className="usetting">
            <div className="usettingtitle"> Customize profile </div>
            <div className="usettingtitlemeta"> PROFILE INFO </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Background Pic </div>
                <div className="usettingitemmetatitle"> Community wall pic. </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light wallpicwrapper">
                  <img className="wallpic" src={pic} alt="wall_pic" />
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Profile Pic </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light picwrapper">
                  <img className="pic" src={pic} alt="profile_pic" />
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Description </div>
                <div className="usettingitemmetatitle"> { communityState.description || "Describe your community in one line or so."} </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light btn black-text blue usettingitembtn">
                  Update
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> About </div>
                <div className="usettingitemmetatitle"> { communityState.about || "Write here all about your community."} </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light btn black-text blue usettingitembtn">
                  Update
                </div>
              </div>
            </div>            
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Social links </div>
                <div className="usettingitemmetatitle"> People who visit community will see social links. </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light btn black-text blue usettingitembtn">
                  Update
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> PROFILE CATEGORY </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> NSFW (Not Safe For Work)</div>
                <div className="usettingitemmetatitle"> This content is NSFW (may contain nudity, pornography, profanity or inappropriate content for those under 18) </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch">
                  <label>
                    <input type="checkbox" className="blue-text" name="nsfw" checked={profileState.nsfw} onChange={(e: any) => handleChange(e, "profile")} />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> ADVANCED </div>                                                    
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Delete community </div>
                <div className="usettingitemmetatitle">{cname}</div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light btn black-text red usettingitembtn" onClick={handleDeleteAcc}>
                  delete
                </div>
              </div>
            </div>
          </div>
        ) : userOption === "privacy" ? (
          <div className="usetting">
            <div className="usettingtitle"> Manage Privacy </div>
            <div className="usettingtitlemeta"> Safety </div>            
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Blocked users</div>
                <div className="usettingitemmetatitle"> Blocked people can’t see community. </div>
              </div>
              <div className="usettingitemchange">
                <div className="waves-effect waves-light btn black-text blue usettingitembtn">
                  Update
                </div>
              </div>
            </div>            
            <div className="usettingtitlemeta"> privacy </div>                         
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Community privacy </div>
              </div>
              <div className="usettingitemdrop">
                <Patdrop profile={ privacyDropperprofile } droppers={ privacyDroppers } />
              </div>
            </div> 
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Allow people to follow </div>
                <div className="usettingitemmetatitle"> Followers will be notified about posts done in community or see them in their home feed. </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch">
                  <label>
                    <input type="checkbox" className="blue-text" name="allowppltofollow" checked={privacyState.allowppltofollow} onChange={(e: any) => handleChange(e, "profile")} />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>        
          </div>        
        ) : userOption === "notifications" && (
          <div className="usetting">
            <div className="usettingtitle"> Notification Preferences </div>
            <div className="usettingtitlemeta"> Messages </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> New user requests </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input type="checkbox" className="blue-text" name="newuserreq" checked={notificationsState.newuserreq} onChange={(e: any) => handleChange(e, "notifications")} />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingtitlemeta"> Activity </div>            
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Post Reports </div>
                <div className="usettingitemmetatitle"> Any user reports post of community.</div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input type="checkbox" className="blue-text" name="reportonpost" checked={notificationsState.reportonpost} onChange={(e: any) => handleChange(e, "notifications")} />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Comment Reports </div>
                <div className="usettingitemmetatitle"> Any user reports comment done on any post of community.</div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input type="checkbox" className="blue-text" name="reportoncmnt" checked={notificationsState.reportoncmnt} onChange={(e: any) => handleChange(e, "notifications")} />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> User Reports </div>
                <div className="usettingitemmetatitle"> Any user reports another user of community.</div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input type="checkbox" className="blue-text" name="reportonuser" checked={notificationsState.reportonuser} onChange={(e: any) => handleChange(e, "notifications")} />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Activity in community </div>
                <div className="usettingitemmetatitle"> Any kind of activity (new posts, new suggested rules, new suggested pinned posts, new rooms) in community.</div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input type="checkbox" className="blue-text" name="activityincommunity" checked={notificationsState.activityincommunity} onChange={(e: any) => handleChange(e, "notifications")} />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>            
            <div className="usettingtitlemeta"> Updates </div>
            <div className="usettingitems">
              <div className="usettingitemlabels">
                <div className="usettingitemtitle"> Birthday </div>
                <div className="usettingitemmetatitle"> Any community user birthday. </div>
              </div>
              <div className="usettingitemchange">
                <div className="switch blue-text">
                  <label>
                    <input type="checkbox" className="blue-text" name="birthday" checked={notificationsState.birthday} onChange={(e: any) => handleChange(e, "notifications")} />
                    <span className="lever"></span>
                  </label>
                </div>
              </div>
            </div>            
          </div>
        )}
      </div>
    </>
  );
}

export default Communitysetting;