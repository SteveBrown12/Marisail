import PropTypes from 'prop-types';
import { Card, Container } from 'react-bootstrap';

const SponsorsRanking = ({ sponsors }) => {
  return (
    <Container className='my-3'>
      <h3>Our Sponsors</h3>

      <Container
        className='py-4'
        style={{
          display: 'grid',
          gridTemplateColumns: ' repeat( auto-fill, minmax(180px, 1fr) )',
        }}
      >
        {sponsors.ok &&
          sponsors.result.map((el, i) => (
            <Card key={i} className='text-center py-2 border-0'>
              {el.company_name}
            </Card>
          ))}
      </Container>
    </Container>
  );
};
SponsorsRanking.propTypes = {
  sponsors: PropTypes.object.isRequired,
};

export default SponsorsRanking;
