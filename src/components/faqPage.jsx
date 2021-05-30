import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
export default function FaqPage(props) {
    return (
        <div className="faqPage boxStyle p-4">
            <h2>FREQUENTLY ASKED QUESTION</h2>
            <hr />

            <Accordion defaultActiveKey="0">
                <Card bg="transparent">
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                        <h4 class="text-light">Ipsum elit ea non magna qui officia.</h4>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            Nostrud irure incididunt fugiat in adipisicing irure non incididunt
                            excepteur anim laboris dolore. Nisi sit cillum irure laborum velit in
                            qui pariatur duis nisi ut Lorem. Aliqua laboris Lorem incididunt
                            exercitation tempor qui. Dolore sit excepteur aliqua eu velit anim
                            fugiat eiusmod reprehenderit ea cillum deserunt commodo. Laboris laboris
                            Lorem minim enim eiusmod excepteur. Cupidatat velit exercitation quis
                            consequat. Adipisicing incididunt proident velit anim velit consequat
                            aute aliquip Lorem do ipsum ut labore minim.
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card bg="transparent">
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                        <h4 class="text-light">Enim est qui aliquip ea ex consequat dolore ut.</h4>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                            Sint quis magna cupidatat id non ut ex Lorem velit. Cillum minim minim
                            mollit cillum quis nulla nostrud proident sit Lorem dolor eiusmod.
                            Tempor nisi adipisicing proident irure eiusmod sint proident cupidatat
                            nisi. Irure nulla commodo sunt eiusmod anim do laborum voluptate dolor.
                            Sit ex Lorem exercitation adipisicing Lorem magna enim consequat qui.
                            Consectetur nostrud in eiusmod excepteur exercitation quis veniam.
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </div>
    );
}
