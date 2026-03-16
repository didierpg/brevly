export interface LinkProps {
  id: string;
  originalUrl: string;
  shortCode: string;
  accessCount: number;
  createdAt: Date;
}

export class Link {
  private props: LinkProps;

  constructor(props: LinkProps) {
    this.props = props;
  }

  get id() {
    return this.props.id;
  }
  get originalUrl() {
    return this.props.originalUrl;
  }
  get shortCode() {
    return this.props.shortCode;
  }
  get accessCount() {
    return this.props.accessCount;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  public incrementAccess() {
    this.props.accessCount++;
  }
}
