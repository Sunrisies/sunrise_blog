# Sunrise Blog API 设计

## API 概览

Sunrise Blog 提供了 RESTful API，所有 API 请求都使用 `/api` 作为前缀，并返回 JSON 格式的数据。

## 认证机制

系统使用 JWT (JSON Web Token) 进行身份认证，除部分公开 API 外，其他 API 均需要在请求头中携带有效的 JWT Token。

```
Authorization: Bearer <JWT_TOKEN>
```

## 通用响应格式

成功响应格式：
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

错误响应格式：
```json
{
  "code": 400,
  "message": "请求参数验证失败",
  "data": {
    "errors": [
      {
        "field": "title",
        "errors": ["标题不能为空"]
      }
    ]
  }
}
```

## API 详细设计

### 1. 认证模块 (Auth)

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "user_name": "string",
  "pass_word": "string"
}

Response:
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "string",
    "user": {
      "id": "number",
      "user_name": "string",
      "email": "string",
      "role": "string",
      "permissions": "number"
    }
  }
}
```

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "user_name": "string",
  "pass_word": "string",
  "email": "string",
  "phone": "string"
}

Response:
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "id": "number",
    "user_name": "string",
    "email": "string",
    "role": "string",
    "created_at": "datetime"
  }
}
```

#### 刷新Token
```
POST /api/auth/refresh
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "token": "string"
  }
}
```

#### 获取用户信息
```
GET /api/auth/profile
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "code": 200,
  "message": "获取用户信息成功",
  "data": {
    "id": "number",
    "user_name": "string",
    "email": "string",
    "phone": "string",
    "image": "string",
    "role": "string",
    "permissions": "number",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

#### 更新用户信息
```
PUT /api/auth/profile
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "email": "string",
  "phone": "string",
  "image": "string"
}

Response:
{
  "code": 200,
  "message": "更新用户信息成功",
  "data": {
    "id": "number",
    "user_name": "string",
    "email": "string",
    "phone": "string",
    "image": "string",
    "updated_at": "datetime"
  }
}
```

### 2. 文章模块 (Article)

#### 获取文章列表
```
GET /api/article?page=1&limit=10&category=技术&tag=NodeJS&title=关键词

Query Parameters:
- page: number (页码，默认为1)
- limit: number (每页数量，默认为10)
- category: string (分类筛选，可选)
- tag: string (标签筛选，可选)
- title: string (标题搜索关键词，可选)

Response:
{
  "code": 200,
  "message": "获取文章列表成功",
  "data": {
    "items": [
      {
        "id": "number",
        "uuid": "string",
        "title": "string",
        "description": "string",
        "cover": "string",
        "author": "string",
        "publish_time": "datetime",
        "update_time": "datetime",
        "views": "number",
        "is_top": "boolean",
        "is_recommend": "boolean",
        "is_publish": "boolean",
        "category": {
          "id": "number",
          "name": "string"
        },
        "tags": [
          {
            "id": "number",
            "name": "string"
          }
        ]
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### 获取文章详情
```
GET /api/article/:id

Path Parameters:
- id: string (文章ID或UUID)

Response:
{
  "code": 200,
  "message": "获取文章详情成功",
  "data": {
    "id": "number",
    "uuid": "string",
    "title": "string",
    "content": "string",
    "description": "string",
    "cover": "string",
    "author": "string",
    "publish_time": "datetime",
    "update_time": "datetime",
    "views": "number",
    "is_top": "boolean",
    "is_recommend": "boolean",
    "is_publish": "boolean",
    "size": "number",
    "category": {
      "id": "number",
      "name": "string",
      "description": "string"
    },
    "tags": [
      {
        "id": "number",
        "name": "string",
        "description": "string"
      }
    ],
    "comments": [
      {
        "id": "number",
        "content": "string",
        "user": {
          "id": "number",
          "user_name": "string",
          "image": "string"
        },
        "created_at": "datetime"
      }
    ]
  }
}
```

#### 创建文章
```
POST /api/article
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "title": "string",
  "content": "string",
  "description": "string",
  "cover": "string",
  "author": "string",
  "category_id": "number",
  "tag_ids": ["number"],
  "is_top": "boolean",
  "is_recommend": "boolean",
  "is_publish": "boolean"
}

Response:
{
  "code": 200,
  "message": "创建文章成功",
  "data": {
    "id": "number",
    "uuid": "string",
    "title": "string",
    "created_at": "datetime"
  }
}
```

#### 更新文章
```
PUT /api/article/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Path Parameters:
- id: string (文章ID或UUID)

Request Body:
{
  "title": "string",
  "content": "string",
  "description": "string",
  "cover": "string",
  "category_id": "number",
  "tag_ids": ["number"],
  "is_top": "boolean",
  "is_recommend": "boolean",
  "is_publish": "boolean"
}

Response:
{
  "code": 200,
  "message": "更新文章成功",
  "data": {
    "id": "number",
    "uuid": "string",
    "title": "string",
    "updated_at": "datetime"
  }
}
```

#### 删除文章
```
DELETE /api/article/:id
Authorization: Bearer <JWT_TOKEN>

Path Parameters:
- id: string (文章ID或UUID)

Response:
{
  "code": 200,
  "message": "删除文章成功",
  "data": null
}
```

#### 获取文章时间轴
```
GET /api/article/timeline

Response:
{
  "code": 200,
  "message": "获取文章时间轴成功",
  "data": [
    {
      "year": "number",
      "months": [
        {
          "month": "number",
          "articles": [
            {
              "id": "number",
              "uuid": "string",
              "title": "string",
              "publish_time": "datetime"
            }
          ]
        }
      ]
    }
  ]
}
```

#### 获取上一篇和下一篇文章
```
GET /api/article/prevNext/:id

Path Parameters:
- id: string (文章ID或UUID)

Response:
{
  "code": 200,
  "message": "获取上一篇和下一篇文章成功",
  "data": {
    "prev": {
      "id": "number",
      "uuid": "string",
      "title": "string",
      "publish_time": "datetime"
    },
    "next": {
      "id": "number",
      "uuid": "string",
      "title": "string",
      "publish_time": "datetime"
    }
  }
}
```

### 3. 评论模块 (Article Comments)

#### 获取评论列表
```
GET /api/article-comments?article_id=1&page=1&limit=10

Query Parameters:
- article_id: number (文章ID，必需)
- page: number (页码，默认为1)
- limit: number (每页数量，默认为10)

Response:
{
  "code": 200,
  "message": "获取评论列表成功",
  "data": {
    "items": [
      {
        "id": "number",
        "content": "string",
        "user": {
          "id": "number",
          "user_name": "string",
          "image": "string"
        },
        "created_at": "datetime"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### 创建评论
```
POST /api/article-comments
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "article_id": "number",
  "content": "string",
  "parent_id": "number" (可选，用于回复评论)
}

Response:
{
  "code": 200,
  "message": "创建评论成功",
  "data": {
    "id": "number",
    "content": "string",
    "created_at": "datetime"
  }
}
```

### 4. 分类模块 (Categories)

#### 获取分类列表
```
GET /api/categories

Response:
{
  "code": 200,
  "message": "获取分类列表成功",
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "article_count": "number"
    }
  ]
}
```

#### 创建分类
```
POST /api/categories
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "name": "string",
  "description": "string"
}

Response:
{
  "code": 200,
  "message": "创建分类成功",
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "created_at": "datetime"
  }
}
```

### 5. 标签模块 (Tags)

#### 获取标签列表
```
GET /api/tags

Response:
{
  "code": 200,
  "message": "获取标签列表成功",
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "article_count": "number"
    }
  ]
}
```

#### 创建标签
```
POST /api/tags
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "name": "string",
  "description": "string"
}

Response:
{
  "code": 200,
  "message": "创建标签成功",
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "created_at": "datetime"
  }
}
```

### 6. 留言板模块 (Message)

#### 获取留言列表
```
GET /api/message?page=1&limit=10

Query Parameters:
- page: number (页码，默认为1)
- limit: number (每页数量，默认为10)

Response:
{
  "code": 200,
  "message": "获取留言列表成功",
  "data": {
    "items": [
      {
        "id": "number",
        "content": "string",
        "user": {
          "id": "number",
          "user_name": "string",
          "image": "string"
        },
        "created_at": "datetime"
      }
    ],
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### 创建留言
```
POST /api/message
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Request Body:
{
  "content": "string"
}

Response:
{
  "code": 200,
  "message": "创建留言成功",
  "data": {
    "id": "number",
    "content": "string",
    "created_at": "datetime"
  }
}
```

### 7. 文件存储模块 (Storage)

#### 上传文件
```
POST /api/storage/upload
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Request Body:
- file: File (要上传的文件)

Response:
{
  "code": 200,
  "message": "文件上传成功",
  "data": {
    "url": "string",
    "filename": "string",
    "size": "number",
    "mimetype": "string"
  }
}
```

## API 状态码

| 状态码 | 说明 |
|-------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 权限说明

系统采用基于角色的权限控制(RBAC)，主要角色包括：

| 角色 | 权限值 | 说明 |
|------|--------|------|
| ADMIN | 0xfff | 管理员，拥有所有权限 |
| EDITOR | 0b1111 | 编辑者，可以管理文章和评论 |
| USER | 0b101011 | 普通用户，可以阅读文章、发表评论和留言 |
| GUEST | 0b1 | 访客，只能阅读文章 |

权限位说明：

| 权限位 | 值 | 说明 |
|--------|-----|------|
| 0 | 1 << 0 | 文章读取权限 |
| 1 | 1 << 1 | 文章写入权限 |
| 2 | 1 << 2 | 文章删除权限 |
| 3 | 1 << 3 | 评论管理权限 |
| 4 | 1 << 4 | 用户管理权限 |
| 5 | 1 << 5 | 系统管理权限 |
| 6 | 1 << 6 | 文件管理权限 |
| 7 | 1 << 7 | 标签管理权限 |
| 8 | 1 << 8 | 分类管理权限 |
| 9 | 1 << 9 | 留言管理权限 |
