import React from 'react';

const PostSkeleton = () => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          .skeleton {
            background: #f6f7f8;
            background-image: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
            background-repeat: no-repeat;
            background-size: 1000px 100%;
            animation: shimmer 2s infinite linear forwards;
          }
          .skeleton-card {
            background: white;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 16px;
            border: 1px solid rgba(0, 0, 0, 0.12);
            box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
          }
          .skeleton-header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
          }
          .skeleton-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin-right: 12px;
            flex-shrink: 0;
          }
          .skeleton-text-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .skeleton-text-line {
            height: 12px;
            border-radius: 4px;
          }
          .skeleton-image {
            width: 100%;
            height: 300px;
            border-radius: 4px;
            margin-top: 16px;
          }
        `}
      </style>
      <div className="skeleton-card">
        <div className="skeleton-header">
          <div className="skeleton skeleton-avatar"></div>
          <div className="skeleton-text-container">
            <div className="skeleton skeleton-text-line" style={{ width: '40%' }}></div>
            <div className="skeleton skeleton-text-line" style={{ width: '25%' }}></div>
          </div>
        </div>
        <div className="skeleton skeleton-text-line" style={{ width: '100%', marginBottom: '8px' }}></div>
        <div className="skeleton skeleton-text-line" style={{ width: '90%' }}></div>
        <div className="skeleton skeleton-image"></div>
      </div>
    </>
  );
};

export default PostSkeleton;
