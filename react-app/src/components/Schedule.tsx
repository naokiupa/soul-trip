import type { DaySchedule, TravelActivity } from '../types';
import styles from '../App.module.css';

interface ScheduleProps {
  schedule: DaySchedule[];
}

export const Schedule: React.FC<ScheduleProps> = ({ schedule }) => {
  const getActivityClass = (activity: TravelActivity) => {
    if (activity.type === 'empty') {
      return styles.emptySlot;
    }
    
    let className = styles.activity;
    
    if (activity.activityType === 'flight') {
      className += ` ${styles.flight}`;
    } else if (activity.activityType === 'transfer') {
      className += ` ${styles.transfer}`;
    } else if (activity.activityType === 'immigration') {
      className += ` ${styles.immigration}`;
    }
    
    return className;
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line: string, index: number) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {schedule.map((day, index) => (
        <div key={index} className={styles.daySection}>
          <div className={styles.dayHeader}>
            <span className={styles.dateBadge}>{day.date}</span>
            <span>{day.day}</span>
          </div>
          
          {day.activities.map((activity, actIndex) => (
            <div key={actIndex} className={styles.timeSlot}>
              <div className={styles.time}>{activity.time}</div>
              <div className={getActivityClass(activity)}>
                {activity.type === 'empty' ? (
                  <span>{activity.activity}</span>
                ) : (
                  <>
                    <div className={styles.activityTitle}>{activity.activity}</div>
                    {activity.details && (
                      <div className={styles.activityDetails}>
                        {formatText(activity.details)}
                      </div>
                    )}
                    {activity.flightInfo && (
                      <div className={styles.flightInfo}>
                        {formatText(activity.flightInfo)}
                      </div>
                    )}
                    {activity.imageUrl && (
                      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <img 
                          src={activity.imageUrl} 
                          alt={activity.activity}
                          style={{ 
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>
                    )}
                    {activity.flightLink && (
                      <a 
                        href={activity.flightLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: 'inline-block',
                          marginTop: '8px',
                          padding: '6px 12px',
                          backgroundColor: (activity.activity.includes('ホテル') || activity.activity.includes('夜景') || activity.activity.includes('クルーズ') || activity.activity.includes('ショッピング')) ? '#dc3545' : activity.activityType === 'immigration' ? '#28a745' : '#007bff',
                          color: 'white',
                          borderRadius: '4px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = (activity.activity.includes('ホテル') || activity.activity.includes('夜景') || activity.activity.includes('クルーズ') || activity.activity.includes('ショッピング')) ? '#c82333' : activity.activityType === 'immigration' ? '#218838' : '#0056b3'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = (activity.activity.includes('ホテル') || activity.activity.includes('夜景') || activity.activity.includes('クルーズ') || activity.activity.includes('ショッピング')) ? '#dc3545' : activity.activityType === 'immigration' ? '#28a745' : '#007bff'}
                      >
                        {(activity.activity.includes('夜景') || activity.activity.includes('ホテル') || activity.activity.includes('クルーズ') || activity.activity.includes('ショッピング')) ? '📍 地図を開く' : activity.activityType === 'immigration' ? '電子申請 →' : 'フライト情報を確認 →'}
                      </a>
                    )}
                    {activity.duration && (
                      <span className={styles.duration}>{activity.duration}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>📝 メモ</h3>
        <ul style={{ color: '#555', lineHeight: '1.8' }}>
          <li>総旅費: ¥147,183（搭乗者2名分）</li>
          <li>空港での移動時間は交通状況により変動する可能性があります</li>
          <li>仁川空港⇔ソウル駅の移動は、A'REX直通列車が最速です</li>
          <li>空き時間に追加したい観光地や食事をお知らせください</li>
        </ul>
      </div>
    </>
  );
};