import { ExplorePublicationsQuery } from "@/graphql/generated";
import React from "react";
import styles from "../styles/FeedPost.module.css";
import { MediaRenderer } from "@thirdweb-dev/react";
import Link from "next/link";

type Props = {
  publication: ExplorePublicationsQuery["explorePublications"]["items"][0];
};

export default function FeedPost({ publication }: Props) {
  return (
    <div className={styles.feedPostContainer}>
      <div className={styles.feedPostHeader}>
        {/* Author Profile picture */}
        <MediaRenderer
          //@ts-ignore
          src={publication?.profile?.picture?.original?.url || ""}
          alt={publication.profile.name || publication.profile.handle}
          className={styles.feedPostProfilePicture}
        />

        {/* Author Profile name */}
        <Link
          href={`/profile/${publication.profile.handle}`}
          className={styles.feedPostContentName}
        >
          {publication.profile.name || publication.profile.handle}
        </Link>
      </div>
      <div className={styles.feedPostContent}>
        {/* Name of post */}
        <h3 className={styles.feedPostContentTitle}>
          {publication.metadata.name}
        </h3>
        {/* Description */}
        <p className={styles.feedPostContentDescription}>
          {publication.metadata.content}
        </p>
        {/* Image / media */}
        {publication.metadata.media?.length > 0 && (
          <MediaRenderer
            src={publication.metadata.media[0].original.url}
            alt={publication.metadata.name || ""}
            className={styles.feedPostContentImage}
          />
        )}
      </div>
      <div className={styles.feedPostFooter}>
        <p>{publication.stats.totalAmountOfCollects} Collects</p>
        <p>{publication.stats.totalAmountOfComments} Comments</p>
        <p>{publication.stats.totalAmountOfMirrors} Mirrors</p>
      </div>
    </div>
  );
}
