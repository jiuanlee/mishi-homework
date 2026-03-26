#!/bin/bash
# 密室做题家 - 数据库备份脚本
# 用法：./backup-db.sh

set -e

# 配置
BACKUP_DIR="/opt/backups/db"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="密室做题家-db-1"
DB_USER="${DB_USER:-mizhi_user}"
DB_NAME="${DB_NAME:-mizhi_db}"
RETENTION_DAYS=30

# 创建备份目录
mkdir -p $BACKUP_DIR

echo "==================================="
echo "开始数据库备份"
echo "时间：$(date)"
echo "==================================="

# PostgreSQL 备份
echo "[1/3] 备份 PostgreSQL 数据库..."
docker exec $CONTAINER_NAME pg_dump -U ${DB_USER} ${DB_NAME} | gzip > $BACKUP_DIR/db_${DATE}.sql.gz

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h $BACKUP_DIR/db_${DATE}.sql.gz | cut -f1)
    echo "✓ PostgreSQL 备份完成：db_${DATE}.sql.gz (${BACKUP_SIZE})"
else
    echo "✗ PostgreSQL 备份失败"
    exit 1
fi

# Redis 备份
echo "[2/3] 备份 Redis 数据..."
docker exec 密室做题家-redis-1 redis-cli BGSAVE
sleep 2
docker cp 密室做题家-redis-1:/data/dump.rdb $BACKUP_DIR/redis_${DATE}.rdb

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h $BACKUP_DIR/redis_${DATE}.rdb | cut -f1)
    echo "✓ Redis 备份完成：redis_${DATE}.rdb (${BACKUP_SIZE})"
else
    echo "✗ Redis 备份失败"
    exit 1
fi

# 清理旧备份
echo "[3/3] 清理 ${RETENTION_DAYS} 天前的备份..."
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
find $BACKUP_DIR -name "redis_*.rdb" -mtime +${RETENTION_DAYS} -delete

REMAINING=$(ls -1 $BACKUP_DIR/db_*.sql.gz 2>/dev/null | wc -l)
echo "✓ 保留 ${REMAINING} 个备份文件"

# 备份日志
echo "" >> /var/log/backup.log
echo "[$(date)] 备份完成：db_${DATE}.sql.gz" >> /var/log/backup.log

echo ""
echo "==================================="
echo "备份完成!"
echo "备份位置：$BACKUP_DIR"
echo "==================================="

# 可选：上传到云存储
# echo "上传到阿里云 OSS..."
# ossutil cp $BACKUP_DIR/db_${DATE}.sql.gz oss://your-bucket/backups/
