import { IComment } from 'app/models'
import { Comment } from './Comment'

type IProps = {
  comments?: IComment[]
  isChildren?: boolean
}

export function CommentList({ comments = [], isChildren = false }: IProps) {
  return (
    <>
      {comments.map((comment: IComment) => (
        <div key={comment.commentId} className="comment-stack">
          <Comment isChildren={isChildren} commentDetail={comment} />
        </div>
      ))}
    </>
  )
}
