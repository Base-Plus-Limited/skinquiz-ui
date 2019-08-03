export interface FooterProps {
  progressCount: number;
}

const Footer: React.FC<FooterProps> = ({ progressCount }: FooterProps) => {
  return (
    <footer>
      <span>
        {progressCount}
      </span>
    </footer>
  );
}

export default Footer;