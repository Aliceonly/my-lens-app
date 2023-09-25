import React from "react";
import styles from "../../styles/Profile.module.css";
import { useProfileQuery, usePublicationsQuery } from "@/graphql/generated";
import { useRouter } from "next/router";
import { MediaRenderer, Web3Button } from "@thirdweb-dev/react";
import FeedPost from "@/components/FeedPost";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "@/const/contract";
import { useFollow } from "@/lib/useFollow";

type Props = {};

export default function ProfilePage({}: Props) {
  const router = useRouter();
  const { id } = router.query;

  const { mutateAsync: followUser } = useFollow();

  const {
    isLoading: loadingProfile,
    data: profileData,
    error: profileError,
  } = useProfileQuery(
    {
      request: {
        handle: id,
      },
    },
    {
      enabled: !!id,
    }
  );

  const {
    isLoading: isLoadingPublications,
    data: publicationsData,
    error: publicationsError,
  } = usePublicationsQuery(
    {
      request: {
        profileId: profileData?.profile?.id,
      },
    },
    {
      enabled: !!profileData?.profile?.id,
    }
  );

  console.log({
    profileData,
    loadingProfile,
    isLoadingPublications,
    publicationsData,
  });

  if (publicationsError || profileError) return <div>No Profile</div>;

  if (loadingProfile) return <div>Loading Profile...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileContentContainer}>
        {/* Cover Image */}
        {/* @ts-ignore */}
        {profileData?.profile?.coverPicture?.original?.url && (
          <MediaRenderer
            //@ts-ignore
            src={profileData?.profile?.coverPicture?.original?.url || ""}
            alt={
              profileData?.profile?.name || profileData?.profile?.handle || ""
            }
            className={styles.coverImageContainer}
          />
        )}
        {/* Profile Picture */}
        {/* @ts-ignore */}
        {profileData?.profile?.picture?.original?.url && (
          <MediaRenderer
            // @ts-ignore
            src={profileData.profile.picture.original.url}
            alt={profileData.profile.name || profileData.profile.handle || ""}
            className={styles.profilePictureContainer}
          />
        )}
        {/* Profile Name */}
        <h1 className={styles.profileName}>
          {profileData?.profile?.name || "Unknown User"}
        </h1>
        {/* Profile Handle */}
        <p className={styles.profileHandle}>
          @{profileData?.profile?.handle || "Unknown User"}
        </p>
        {/* Profile Description */}
        <p className={styles.profileDescription}>{profileData?.profile?.bio}</p>

        <p className={styles.followerCount}>
          {profileData?.profile?.stats.totalFollowers} {" Followers"}
        </p>

        <Web3Button
          contractAddress={LENS_CONTRACT_ADDRESS}
          contractAbi={LENS_CONTRACT_ABI}
          action={async() => await followUser(profileData?.profile?.id)}
        >
          Follow User
        </Web3Button>

        <div className={styles.publicationsContainer}>
          {/* Publication FeedItem */}
          {isLoadingPublications ? (
            <div>Loading profile... </div>
          ) : (
            publicationsData?.publications.items.map((publication) => (
              <FeedPost publication={publication} key={publication.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
