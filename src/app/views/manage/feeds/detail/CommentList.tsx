import { IComment, ICustomerDetail } from 'app/models'
import { Comment } from './Comment'

type IProps = {
  comments?: IComment[]
  customer?: ICustomerDetail
  isChildren?: boolean
}

export function CommentList({
  comments = [],
  isChildren = false,
  customer,
}: IProps) {
  return (
    <>
      {comments.map((comment: IComment) => (
        <div key={comment.commentId} className="comment-stack">
          <Comment
            isChildren={isChildren}
            commentDetail={comment}
            customer={customer}
          />
        </div>
      ))}
    </>
  )
}
